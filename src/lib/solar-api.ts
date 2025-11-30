// Solar calculations backend - Production APIs only
const API_URL = process.env.NEXT_PUBLIC_NETZEROEXPERT_API_URL ||
                'https://netzeroexpert-platform.vercel.app/api'

// Validate that we have a production API URL
if (typeof window !== 'undefined' && API_URL.includes('localhost') && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  Production build detected but using localhost API. Check environment variables.')
}

// AI-Enhanced endpoints for new features
export async function askSolarAI(query: string, context?: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/solar-ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context })
    });
    
    if (!response.ok) throw new Error('AI chat request failed');
    return await response.json();
  } catch (error) {
    console.error('Solar AI Chat error:', error);
    return { error: 'Failed to get AI response' };
  }
}

export async function getIntelligentAnalysis(data: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/intelligent-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Intelligent analysis failed');
    return await response.json();
  } catch (error) {
    console.error('Intelligent Analysis error:', error);
    return { error: 'Analysis failed' };
  }
}

// Import state-specific pricing data for fallback
import { statePricing } from './state-pricing'
import { SolarRoofEngineer, type EnhancedSolarInsights } from './solar-roof-engineering'

// Google Solar API for real roof analysis
interface GoogleSolarResponse {
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
    wholeRoofStats: {
      areaMeters2: number;
      sunshineQuantiles: number[];
      groundAreaMeters2: number;
    };
  };
  financialAnalyses?: Array<{
    monthlyBill: {
      currencyCode: string;
      units: string;
    };
    defaultBill: boolean;
    averageKwhPerMonth: number;
    panels: Array<{
      panelsCount: number;
      yearlyEnergyDcKwh: number;
      lifetimeEnergyDcKwh: number;
    }>;
  }>;
  buildingInsights: {
    center: {
      latitude: number;
      longitude: number;
    };
    imageryDate: {
      year: number;
      month: number;
      day: number;
    };
    postalCode: string;
    administrativeArea: string;
    statisticalArea: string;
    regionCode: string;
    imageryProcessedDate: {
      year: number;
      month: number;
      day: number;
    };
    imageryQuality: string;
  };
}

class GoogleSolarAPI {
  private static readonly API_KEY = process.env.GOOGLE_API_KEY;
  private static readonly BASE_URL = 'https://solar.googleapis.com/v1/buildingInsights:findClosest';

  static async getBuildingSolarData(lat: number, lng: number): Promise<GoogleSolarResponse | null> {
    if (!this.API_KEY) {
      console.warn('Google Solar API key not configured, using fallback calculations');
      return null;
    }

    try {
      const params = new URLSearchParams({
        'location.latitude': lat.toString(),
        'location.longitude': lng.toString(),
        key: this.API_KEY
      });

      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Google Solar API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google Solar API error:', error);
      return null;
    }
  }
}

export interface SolarInsights {
  building_stats: {
    roof_area_sqft: number
    roof_area_m2: number
    roof_area_solar: number
  }
  solar_potential: {
    max_panels: number
    panel_capacity_watts: number
    yearly_energy_dc_kwh: number
    carbon_offset_tons: number
    max_sunshine_hours: number
  }
  financial_analysis: {
    panels_config_size: number
    yearly_energy_kwh: number
    installation_size_kw: number
  }
  imagery_info: {
    imagery_date: string
    imagery_quality: string
    postal_code: string
    administrative_area: string
  }
}

// Enhanced Solar Insights with Real Engineering
export async function getEnhancedSolarInsights(lat: number, lng: number): Promise<EnhancedSolarInsights | null> {
  // Get Google Solar API data
  const googleData = await GoogleSolarAPI.getBuildingSolarData(lat, lng);
  
  if (googleData?.solarPotential && googleData?.buildingInsights) {
    const roofAreaSqFt = googleData.solarPotential.wholeRoofStats.areaMeters2 * 10.764; // Convert m² to ft²
    const maxPanelsGoogle = googleData.solarPotential.maxArrayPanelsCount;
    const sunshineHours = googleData.solarPotential.maxSunshineHoursPerYear || 1600;
    
    // Calculate engineering reality with setbacks and spacing
    const engineeringAnalysis = SolarRoofEngineer.calculateEngineeredCapacity(
      roofAreaSqFt,
      maxPanelsGoogle,
      lat // Use latitude for optimal tilt calculation
    );
    
    // Recommended system (80% of engineered max for optimal performance/cost)
    const recommendedPanelCount = Math.floor(engineeringAnalysis.maxPanelsEngineered * 0.8);
    const recommendedSystemSizeKW = (recommendedPanelCount * 400) / 1000;
    const recommendedAnnualProduction = recommendedPanelCount * 400 * sunshineHours / 1000 * 0.86; // AC losses
    
    return {
      googleData: {
        maxPanels: maxPanelsGoogle,
        roofAreaSqFt: Math.round(roofAreaSqFt),
        roofAreaM2: Math.round(googleData.solarPotential.wholeRoofStats.areaMeters2),
        sunshineHours: sunshineHours
      },
      engineeringAnalysis,
      recommendedSystemSize: {
        panelCount: recommendedPanelCount,
        systemSizeKW: Math.round(recommendedSystemSizeKW * 10) / 10,
        annualProductionKWH: Math.round(recommendedAnnualProduction),
        roofUtilization: (recommendedPanelCount / maxPanelsGoogle) * 100
      },
      summary: SolarRoofEngineer.generateEngineeringSummary(engineeringAnalysis)
    };
  }
  
  return null;
}

export async function getSolarInsights(lat: number, lng: number): Promise<SolarInsights | null> {
  // Try Google Solar API first for most accurate data
  const googleData = await GoogleSolarAPI.getBuildingSolarData(lat, lng);
  
  if (googleData?.solarPotential && googleData?.buildingInsights) {
    // Convert Google Solar data to our interface
    return {
      building_stats: {
        roof_area_sqft: Math.round(googleData.solarPotential.wholeRoofStats.areaMeters2 * 10.764), // Convert m² to ft²
        roof_area_m2: Math.round(googleData.solarPotential.wholeRoofStats.areaMeters2),
        roof_area_solar: Math.round(googleData.solarPotential.maxArrayAreaMeters2)
      },
      solar_potential: {
        max_panels: googleData.solarPotential.maxArrayPanelsCount,
        panel_capacity_watts: 400, // Standard panel wattage
        yearly_energy_dc_kwh: googleData.solarPotential.maxArrayPanelsCount * 400 * (googleData.solarPotential.maxSunshineHoursPerYear || 1600) / 1000,
        carbon_offset_tons: googleData.solarPotential.carbonOffsetFactorKgPerMwh / 1000,
        max_sunshine_hours: googleData.solarPotential.maxSunshineHoursPerYear || 1600
      },
      financial_analysis: {
        panels_config_size: Math.round(googleData.solarPotential.maxArrayPanelsCount * 0.4), // 40% of max as recommended
        yearly_energy_kwh: Math.round(googleData.solarPotential.maxArrayPanelsCount * 400 * (googleData.solarPotential.maxSunshineHoursPerYear || 1600) / 1000 * 0.86), // Account for AC losses
        installation_size_kw: Math.round(googleData.solarPotential.maxArrayPanelsCount * 0.4 * 0.4) // 40% of max panels * 400W
      },
      imagery_info: {
        imagery_date: `${googleData.buildingInsights.imageryDate.year}-${googleData.buildingInsights.imageryDate.month.toString().padStart(2, '0')}-${googleData.buildingInsights.imageryDate.day.toString().padStart(2, '0')}`,
        imagery_quality: googleData.buildingInsights.imageryQuality,
        postal_code: googleData.buildingInsights.postalCode,
        administrative_area: googleData.buildingInsights.administrativeArea
      }
    };
  }

  // Fallback to NetZeroExpert platform backend
  try {
    const response = await fetch(`${API_URL}/api/solar-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        return data
      }
    }
  } catch (error) {
    console.error('Error fetching solar insights from backend:', error)
  }
  
  return null
}

export interface UtilityInfo {
  rate: number
  utility_name: string
  source: string
}

// Simple state detection based on lat/lng coordinates
function getStateFromCoordinates(lat: number, lng: number): string {
  // Basic state detection for major states
  // California
  if (lat >= 32.5 && lat <= 42.0 && lng >= -124.5 && lng <= -114.0) {
    return 'CA'
  }
  // Texas
  if (lat >= 25.8 && lat <= 36.5 && lng >= -106.6 && lng <= -93.5) {
    return 'TX'
  }
  // Florida
  if (lat >= 24.4 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) {
    return 'FL'
  }
  // New York
  if (lat >= 40.5 && lat <= 45.0 && lng >= -79.8 && lng <= -71.9) {
    return 'NY'
  }
  // Default for other states
  return 'DEFAULT'
}

// OpenEI Utility Rates API for real-time data
class OpenEIUtilityAPI {
  private static readonly API_KEY = process.env.OPENEI_API_KEY;
  private static readonly BASE_URL = 'https://api.openei.org/utility_rates';

  static async getUtilityRates(lat: number, lng: number): Promise<UtilityInfo | null> {
    if (!this.API_KEY) {
      console.warn('OpenEI API key not configured, using fallback data');
      return null;
    }

    try {
      const params = new URLSearchParams({
        version: 'latest',
        format: 'json',
        api_key: this.API_KEY,
        lat: lat.toString(),
        lon: lng.toString(),
        sector: 'Residential',
        detail: 'full'
      });

      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`OpenEI API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const utility = data.items[0];
        
        // Extract average residential rate from rate structure
        let averageRate = 0.15; // default fallback
        
        if (utility.energyratestructure && utility.energyratestructure.length > 0) {
          const rates = utility.energyratestructure[0];
          if (rates && rates.rate) {
            averageRate = parseFloat(rates.rate);
          }
        }

        return {
          rate: averageRate,
          utility_name: utility.utility || 'Local Utility',
          source: 'OpenEI Real-time Data'
        };
      }
      
      return null;
    } catch (error) {
      console.error('OpenEI API error:', error);
      return null;
    }
  }
}

export async function getUtilityRates(lat: number, lng: number): Promise<UtilityInfo> {
  // Try real-time OpenEI data first
  const realTimeData = await OpenEIUtilityAPI.getUtilityRates(lat, lng);
  if (realTimeData) {
    return realTimeData;
  }

  // Fallback to NetZeroExpert platform backend
  try {
    const response = await fetch(`${API_URL}/api/utility-rates?lat=${lat}&lng=${lng}`)
    
    if (response.ok) {
      const data = await response.json()
      return {
        rate: data.rate || 0.15,
        utility_name: data.utility_name || 'Local Utility',
        source: data.source || 'Backend API'
      }
    }
  } catch (error) {
    console.error('Error fetching utility rates from backend:', error)
  }

  // Use state-specific fallback based on coordinates
  const state = getStateFromCoordinates(lat, lng)
  const stateData = statePricing[state]
  
  if (stateData) {
    return {
      rate: stateData.utilityRate,
      utility_name: stateData.utilityProvider || 'Local Utility',
      source: `State Default (${stateData.stateName})`
    }
  }
  
  // Final fallback for unknown states
  return {
    rate: 0.15,
    utility_name: 'Local Utility',
    source: 'Default Fallback'
  }
}