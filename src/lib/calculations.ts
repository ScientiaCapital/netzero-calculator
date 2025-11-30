import { getStatePricing, getSystemCost } from './state-pricing'
import { SRECCalculator, SRECCalculationResult } from './srec-calculator'

// NREL PVWatts API integration for real-time solar data
interface PVWattsResponse {
  outputs: {
    ac_annual: number;  // Annual AC energy production (kWh)
    solrad_annual: number;  // Annual solar radiation (kWh/m2/day)
    capacity_factor: number;  // Capacity factor (%)
  };
}

class NRELPVWattsAPI {
  private static readonly API_KEY = process.env.PVWATTS_API_KEY;
  private static readonly BASE_URL = 'https://developer.nrel.gov/api/pvwatts/v8.json';

  static async getSystemProduction(params: {
    lat: number;
    lon: number;
    system_capacity: number;
    azimuth?: number;
    tilt?: number;
    array_type?: number;
    module_type?: number;
    losses?: number;
  }): Promise<PVWattsResponse | null> {
    if (!this.API_KEY) {
      console.warn('NREL API key not configured, using fallback calculations');
      return null;
    }

    try {
      const queryParams = new URLSearchParams({
        api_key: this.API_KEY,
        lat: params.lat.toString(),
        lon: params.lon.toString(),
        system_capacity: params.system_capacity.toString(),
        azimuth: (params.azimuth || 180).toString(), // South-facing default
        tilt: (params.tilt || params.lat).toString(), // Latitude tilt default
        array_type: (params.array_type || 1).toString(), // Fixed open rack
        module_type: (params.module_type || 0).toString(), // Standard modules
        losses: (params.losses || 14).toString() // 14% system losses
      });

      const response = await fetch(`${this.BASE_URL}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`NREL API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('NREL PVWatts API error:', error);
      return null;
    }
  }
}

export interface SolarCalculationInput {
  location: {
    address: string;
    latitude: number;
    longitude: number;
    state?: string;
  };
  monthlyBill: number;
  roofArea: number;
  utilityRate: number;
  state?: string;
}

export interface SolarCalculationResult {
  systemSize: number;
  systemCost: number;
  annualProduction: number;
  annualSavings: number;
  paybackPeriod: number;
  twentyYearSavings: number;
  co2Offset: number;
  roiPercent: number;
  incentives: {
    federal: number;
    state: number;
    utility: number;
    total: number;
  };
  srecData?: SRECCalculationResult;
  totalAnnualSavings?: number;  // Electricity + SREC
  totalTwentyYearSavings?: number; // Total with SREC
}

export class SolarCalculator {
  private static readonly SYSTEM_LOSSES = 0.14; // 14% total system losses (industry standard)
  private static readonly DEGRADATION_RATE = 0.005; // 0.5% annual degradation (industry standard)
  private static readonly ITC_RATE = 0.30; // 30% through Dec 31, 2025, then 0% for residential (expires completely)
  private static readonly COST_PER_WATT = 3.00; // Updated 2025 average cost per watt installed

  static async calculate(input: SolarCalculationInput): Promise<SolarCalculationResult> {
    let systemSize = this.estimateSystemSize(input);
    
    // Apply state-specific system size limits
    const state = input.state || input.location.state;
    if (state) {
      const statePricing = getStatePricing(state);
      if (statePricing.maxSystemSize && systemSize > statePricing.maxSystemSize) {
        systemSize = statePricing.maxSystemSize;
      }
    }
    
    // Get real-time production data from NREL PVWatts
    const annualProduction = await this.calculateRealTimeProduction(systemSize, input.location);
    
    // Use state-specific pricing if available
    const systemCost = state 
      ? getSystemCost(state, systemSize)
      : systemSize * 1000 * this.COST_PER_WATT;
    
    const incentives = {
      federal: systemCost * this.ITC_RATE,
      state: systemCost * 0.05,
      utility: systemSize * 100,
      total: 0
    };
    incentives.total = incentives.federal + incentives.state + incentives.utility;

    const netCost = systemCost - incentives.total;
    const annualElectricitySavings = annualProduction * input.utilityRate;
    
    // Calculate SREC income if applicable
    let srecData: SRECCalculationResult | undefined;
    let totalAnnualSavings = annualElectricitySavings;
    let totalTwentyYearSavings = 0;
    
    if (state) {
      srecData = SRECCalculator.calculateSRECIncome(systemSize, annualProduction, state);
      if (srecData.isEligible) {
        totalAnnualSavings = annualElectricitySavings + srecData.annualIncome;
      }
    }
    
    // Calculate payback period with total savings (electricity + SREC)
    const paybackPeriod = netCost / totalAnnualSavings;
    
    // Calculate 20-year savings for electricity
    const twentyYearElectricitySavings = this.calculateLifetimeSavings(
      annualElectricitySavings,
      20,
      this.DEGRADATION_RATE,
      0.03
    );
    
    // Calculate total 20-year savings including SREC
    if (srecData && srecData.isEligible) {
      const srecYears = Math.min(srecData.eligibilityYears, 20);
      const twentyYearSRECIncome = this.calculateLifetimeSavings(
        srecData.annualIncome,
        srecYears,
        this.DEGRADATION_RATE,
        0  // SREC prices don't typically escalate
      );
      totalTwentyYearSavings = twentyYearElectricitySavings + twentyYearSRECIncome;
    } else {
      totalTwentyYearSavings = twentyYearElectricitySavings;
    }

    const roiPercent = ((totalTwentyYearSavings - netCost) / netCost) * 100;
    const co2Offset = (annualProduction * 20 * 0.0007) / 1000;

    return {
      systemSize,
      systemCost,
      annualProduction,
      annualSavings: annualElectricitySavings,
      paybackPeriod,
      twentyYearSavings: twentyYearElectricitySavings,
      co2Offset,
      roiPercent,
      incentives,
      ...(srecData && { srecData }),
      totalAnnualSavings,
      totalTwentyYearSavings
    };
  }

  private static estimateSystemSize(input: SolarCalculationInput): number {
    const annualUsage = (input.monthlyBill / input.utilityRate) * 12;
    // Use location-based peak sun hours estimation
    const peakSunHours = this.estimatePeakSunHours(input.location.latitude);
    const dailyUsage = annualUsage / 365;
    // System size in kW needed to meet daily usage accounting for losses
    const systemSize = dailyUsage / (peakSunHours * (1 - this.SYSTEM_LOSSES));
    return Math.round(systemSize * 10) / 10;
  }

  private static async calculateRealTimeProduction(
    systemSize: number,
    location: { latitude: number; longitude: number }
  ): Promise<number> {
    // Try to get real-time data from NREL PVWatts
    const pvwattsData = await NRELPVWattsAPI.getSystemProduction({
      lat: location.latitude,
      lon: location.longitude,
      system_capacity: systemSize
    });

    if (pvwattsData?.outputs?.ac_annual) {
      // Use real NREL data
      return Math.round(pvwattsData.outputs.ac_annual);
    }

    // Fallback to improved estimation if API fails
    return this.calculateAnnualProduction(systemSize, location);
  }

  private static calculateAnnualProduction(
    systemSize: number,
    location: { latitude: number; longitude: number }
  ): number {
    const peakSunHours = this.estimatePeakSunHours(location.latitude);
    const dailyProduction = systemSize * peakSunHours * (1 - this.SYSTEM_LOSSES);
    return Math.round(dailyProduction * 365);
  }

  private static estimatePeakSunHours(latitude: number): number {
    // Location-based peak sun hours estimation (annual average)
    // Based on NREL data patterns for different latitudes in the US
    const absLat = Math.abs(latitude);
    
    if (absLat <= 25) return 5.5; // Southern states (FL, southern TX, southern CA)
    if (absLat <= 35) return 5.0; // Mid-latitude states (most of CA, TX, southern states)
    if (absLat <= 40) return 4.5; // Central states (most of US)
    if (absLat <= 45) return 4.0; // Northern states (northern Midwest, mountain states)
    return 3.5; // Far northern states (northern border states)
  }

  private static calculateLifetimeSavings(
    annualSavings: number,
    years: number,
    degradationRate: number,
    escalationRate: number
  ): number {
    let totalSavings = 0;
    for (let year = 1; year <= years; year++) {
      const degradationFactor = Math.pow(1 - degradationRate, year - 1);
      const escalationFactor = Math.pow(1 + escalationRate, year - 1);
      totalSavings += annualSavings * degradationFactor * escalationFactor;
    }
    return Math.round(totalSavings);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}