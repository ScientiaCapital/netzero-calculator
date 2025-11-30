/**
 * CalculatorAdapter - Simplified integration for NetZeroCalculator.com
 *
 * Orchestrates the end-to-end workflow for homeowner self-service:
 * 1. Calculate solar/battery/heat pump recommendations
 * 2. Save results to database with tenant_id='calculator'
 * 3. Return formatted response for frontend
 */

import { createServerClient } from '@netzero/database';
import { v4 as uuidv4 } from 'uuid';
import { SolarCalculator } from '@/lib/calculations';
import type { SolarCalculationInput, SolarCalculationResult } from '@/lib/calculations';

export interface CalculatorResponse {
  calculation_id: string;
  results: SolarCalculationResult;
  recommendations: {
    solar_system_size_kw: number;
    battery_capacity_kwh?: number;
    heat_pump_tonnage?: number;
    estimated_cost: number;
    confidence: 'high' | 'medium' | 'low';
  };
  cost: number;
}

export class CalculatorAdapter {
  /**
   * Process solar calculation with full pipeline
   */
  async processCalculation(options: {
    location: {
      address: string;
      latitude: number;
      longitude: number;
      state?: string;
    };
    monthlyBill: number;
    roofArea: number;
    utilityRate: number;
    user_id?: string;
  }): Promise<CalculatorResponse> {
    const { location, monthlyBill, roofArea, utilityRate, user_id } = options;

    // Step 1: Calculate solar recommendations
    const input: SolarCalculationInput = {
      location,
      monthlyBill,
      roofArea,
      utilityRate,
      ...(location.state && { state: location.state }),
    };

    const results = await SolarCalculator.calculate(input);

    // Step 2: Format recommendations
    const recommendations = this.formatRecommendations(results);

    // Step 3: Save to database (if user_id provided)
    let calculation_id = uuidv4();
    if (user_id) {
      calculation_id = await this.saveToDatabase({
        results,
        recommendations,
        user_id,
        location,
      });
    }

    // Step 4: Return formatted response
    return {
      calculation_id,
      results,
      recommendations,
      cost: results.systemCost,
    };
  }

  /**
   * Format recommendations from calculation results
   */
  private formatRecommendations(results: SolarCalculationResult): CalculatorResponse['recommendations'] {
    return {
      solar_system_size_kw: results.systemSize,
      battery_capacity_kwh: results.systemSize * 0.5, // 50% of solar for battery
      estimated_cost: results.systemCost - results.incentives.total,
      confidence: results.systemSize > 0 ? 'high' : 'low',
    };
  }

  /**
   * Save calculation to database
   */
  private async saveToDatabase(options: {
    results: SolarCalculationResult;
    recommendations: CalculatorResponse['recommendations'];
    user_id: string;
    location: { address: string; latitude: number; longitude: number; state?: string };
  }): Promise<string> {
    const { results, recommendations, user_id, location } = options;
    const supabase = await createServerClient();

    const calculation_id = uuidv4();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('solar_calculations')
      .insert({
        id: calculation_id,
        tenant_id: 'calculator',
        user_id,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        state: location.state,
        system_size_kw: results.systemSize,
        system_cost: results.systemCost,
        annual_production_kwh: results.annualProduction,
        annual_savings: results.annualSavings,
        payback_years: results.paybackPeriod,
        twenty_year_savings: results.twentyYearSavings,
        co2_offset_tons: results.co2Offset,
        roi_percent: results.roiPercent,
        federal_incentive: results.incentives.federal,
        state_incentive: results.incentives.state,
        utility_incentive: results.incentives.utility,
        recommendations: JSON.stringify(recommendations),
        srec_data: results.srecData ? JSON.stringify(results.srecData) : null,
      });

    if (error) {
      console.error('Database save failed:', error);
      throw new Error(`Failed to save calculation: ${error.message}`);
    }

    return calculation_id;
  }
}

export default CalculatorAdapter;
