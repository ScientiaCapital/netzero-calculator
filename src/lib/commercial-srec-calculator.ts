/**
 * Commercial SREC Calculator
 * Enhanced calculator for commercial and industrial solar projects
 * Includes advanced modeling for large-scale installations, tax benefits, and portfolio management
 */

import { SRECStateData, getSRECData, isSRECState, SREC_STATES } from './srec-states';

export interface CommercialSRECResult {
  // Basic SREC data
  isEligible: boolean;
  state?: string;
  stateName?: string;
  programName?: string;

  // Commercial-specific calculations
  projectType: 'commercial' | 'industrial' | 'utility_scale' | 'community_solar';
  systemSizeKW: number;
  annualProductionKWH: number;
  annualSRECs: number;

  // Financial modeling
  srecValue: number;
  annualSRECIncome: number;
  lifetimeSRECIncome: number;
  eligibilityYears: number;

  // Commercial-specific benefits
  acceleratedDepreciation: {
    eligible: boolean;
    fiveYearBenefit: number;
    totalTaxBenefit: number;
  };

  // Scale-based incentives
  scaleIncentives: {
    volumeBonus: number;
    aggregationBenefit: number;
    portfolioOptimization: number;
  };

  // Advanced metrics
  levelizedSRECValue: number; // LCOE equivalent for SRECs
  portfolioImpact: {
    diversificationBenefit: number;
    riskReduction: number;
    scalabilityFactor: number;
  };

  // Market intelligence
  marketAnalysis: {
    currentSupply: string;
    demandTrend: string;
    priceVolatility: string;
    recommendedSellTiming: string;
  };

  // Cross-state optimization
  crossStateOptions?: CommercialCrossStateOption[];
  bestMarketRecommendation?: string;

  notes?: string[];
}

export interface CommercialCrossStateOption {
  state: string;
  stateName: string;
  annualIncome: number;
  transportationCost: number;
  netBenefit: number;
  riskFactor: number;
  recommendationScore: number;
}

export interface CommercialProjectInputs {
  systemSizeKW: number;
  annualProductionKWH: number;
  projectType: 'commercial' | 'industrial' | 'utility_scale' | 'community_solar';
  state: string;
  taxRate: number; // Corporate tax rate for depreciation benefits
  projectCost?: number; // For depreciation calculations
  portfolioSize?: number; // Number of projects in portfolio
}

export class CommercialSRECCalculator {

  /**
   * Calculate comprehensive commercial SREC benefits
   */
  static calculateCommercialSREC(inputs: CommercialProjectInputs): CommercialSRECResult {
    const { systemSizeKW, annualProductionKWH, projectType, state, taxRate, projectCost = 0, portfolioSize = 1 } = inputs;

    // Default result for non-SREC states
    const defaultResult: CommercialSRECResult = {
      isEligible: false,
      projectType,
      systemSizeKW,
      annualProductionKWH,
      annualSRECs: 0,
      srecValue: 0,
      annualSRECIncome: 0,
      lifetimeSRECIncome: 0,
      eligibilityYears: 0,
      acceleratedDepreciation: { eligible: false, fiveYearBenefit: 0, totalTaxBenefit: 0 },
      scaleIncentives: { volumeBonus: 0, aggregationBenefit: 0, portfolioOptimization: 0 },
      levelizedSRECValue: 0,
      portfolioImpact: { diversificationBenefit: 0, riskReduction: 0, scalabilityFactor: 1 },
      marketAnalysis: {
        currentSupply: 'No data',
        demandTrend: 'No data',
        priceVolatility: 'No data',
        recommendedSellTiming: 'Not applicable'
      }
    };

    // Normalize and validate state
    const stateCode = this.normalizeStateCode(state);
    if (!stateCode || !isSRECState(stateCode)) {
      return defaultResult;
    }

    const srecData = getSRECData(stateCode);
    if (!srecData) {
      return defaultResult;
    }

    // Calculate base SREC production
    const annualSRECs = annualProductionKWH / 1000; // 1 SREC = 1 MWh

    // Apply commercial scale factors
    const scaleFactor = this.getCommercialScaleFactor(systemSizeKW, projectType);
    const adjustedSRECValue = srecData.value * scaleFactor;

    // Calculate enhanced income streams
    const baseAnnualIncome = annualSRECs * adjustedSRECValue;
    const scaleIncentives = this.calculateScaleIncentives(systemSizeKW, portfolioSize, baseAnnualIncome);
    const totalAnnualIncome = baseAnnualIncome + scaleIncentives.volumeBonus + scaleIncentives.aggregationBenefit;

    // Calculate accelerated depreciation benefits
    const depreciation = this.calculateAcceleratedDepreciation(projectCost, taxRate, systemSizeKW);

    // Portfolio impact analysis
    const portfolioImpact = this.calculatePortfolioImpact(portfolioSize, systemSizeKW, projectType);

    // Market analysis
    const marketAnalysis = this.generateMarketAnalysis(stateCode, systemSizeKW, projectType);

    // Cross-state optimization
    const crossStateOptions = this.analyzeCrossStateOptions(inputs, srecData);
    const bestMarket = this.findBestMarket(crossStateOptions);

    // Calculate levelized SREC value (similar to LCOE)
    const levelizedValue = this.calculateLevelizedSRECValue(totalAnnualIncome, srecData.years);

    return {
      isEligible: true,
      state: stateCode,
      stateName: srecData.name,
      programName: srecData.program,
      projectType,
      systemSizeKW,
      annualProductionKWH,
      annualSRECs: Math.round(annualSRECs * 10) / 10,
      srecValue: adjustedSRECValue,
      annualSRECIncome: Math.round(totalAnnualIncome),
      lifetimeSRECIncome: Math.round(totalAnnualIncome * srecData.years),
      eligibilityYears: srecData.years,
      acceleratedDepreciation: depreciation,
      scaleIncentives,
      levelizedSRECValue: levelizedValue,
      portfolioImpact,
      marketAnalysis,
      crossStateOptions,
      bestMarketRecommendation: bestMarket,
      notes: this.generateCommercialNotes(stateCode, projectType, systemSizeKW)
    };
  }

  /**
   * Get commercial scale factor for SREC pricing
   */
  private static getCommercialScaleFactor(systemSizeKW: number, projectType: string): number {
    // Larger commercial projects often get better SREC pricing due to economies of scale
    let scaleFactor = 1.0;

    // Base scale factor by system size
    if (systemSizeKW >= 5000) { // 5MW+
      scaleFactor = 1.15;
    } else if (systemSizeKW >= 1000) { // 1MW+
      scaleFactor = 1.10;
    } else if (systemSizeKW >= 500) { // 500kW+
      scaleFactor = 1.05;
    }

    // Project type multipliers
    switch (projectType) {
      case 'utility_scale':
        scaleFactor *= 1.08;
        break;
      case 'industrial':
        scaleFactor *= 1.05;
        break;
      case 'community_solar':
        scaleFactor *= 1.03;
        break;
      default: // commercial
        scaleFactor *= 1.0;
    }

    return scaleFactor;
  }

  /**
   * Calculate scale-based incentives and bonuses
   */
  private static calculateScaleIncentives(
    systemSizeKW: number,
    portfolioSize: number,
    baseIncome: number
  ): CommercialSRECResult['scaleIncentives'] {
    // Volume bonus based on system size
    let volumeBonus = 0;
    if (systemSizeKW >= 5000) {
      volumeBonus = baseIncome * 0.08; // 8% bonus for 5MW+
    } else if (systemSizeKW >= 1000) {
      volumeBonus = baseIncome * 0.05; // 5% bonus for 1MW+
    } else if (systemSizeKW >= 500) {
      volumeBonus = baseIncome * 0.02; // 2% bonus for 500kW+
    }

    // Portfolio aggregation benefits
    let aggregationBenefit = 0;
    if (portfolioSize >= 10) {
      aggregationBenefit = baseIncome * 0.06; // 6% portfolio bonus
    } else if (portfolioSize >= 5) {
      aggregationBenefit = baseIncome * 0.03; // 3% portfolio bonus
    }

    // Portfolio optimization (transaction cost reduction)
    const portfolioOptimization = portfolioSize > 1 ? baseIncome * 0.02 : 0;

    return {
      volumeBonus: Math.round(volumeBonus),
      aggregationBenefit: Math.round(aggregationBenefit),
      portfolioOptimization: Math.round(portfolioOptimization)
    };
  }

  /**
   * Calculate accelerated depreciation benefits for commercial projects
   */
  private static calculateAcceleratedDepreciation(
    projectCost: number,
    taxRate: number,
    _systemSizeKW: number
  ): CommercialSRECResult['acceleratedDepreciation'] {
    if (projectCost === 0 || taxRate === 0) {
      return { eligible: false, fiveYearBenefit: 0, totalTaxBenefit: 0 };
    }

    // Commercial solar qualifies for 5-year MACRS depreciation
    const depreciationSchedule = [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576]; // 6-year schedule

    let totalDepreciation = 0;
    let fiveYearDepreciation = 0;

    depreciationSchedule.forEach((rate, index) => {
      const yearlyDepreciation = projectCost * rate;
      totalDepreciation += yearlyDepreciation;
      if (index < 5) {
        fiveYearDepreciation += yearlyDepreciation;
      }
    });

    return {
      eligible: true,
      fiveYearBenefit: Math.round(fiveYearDepreciation * taxRate),
      totalTaxBenefit: Math.round(totalDepreciation * taxRate)
    };
  }

  /**
   * Calculate portfolio impact and risk factors
   */
  private static calculatePortfolioImpact(
    portfolioSize: number,
    systemSizeKW: number,
    projectType: string
  ): CommercialSRECResult['portfolioImpact'] {
    // Diversification benefit increases with portfolio size
    const diversificationBenefit = Math.min(portfolioSize * 0.02, 0.15); // Max 15% benefit

    // Risk reduction through geographic and temporal diversification
    const riskReduction = Math.min(portfolioSize * 0.01, 0.08); // Max 8% risk reduction

    // Scalability factor for future expansion
    let scalabilityFactor = 1.0;
    if (projectType === 'utility_scale') {
      scalabilityFactor = 1.2;
    } else if (systemSizeKW >= 1000) {
      scalabilityFactor = 1.1;
    }

    return {
      diversificationBenefit: Math.round(diversificationBenefit * 100) / 100,
      riskReduction: Math.round(riskReduction * 100) / 100,
      scalabilityFactor
    };
  }

  /**
   * Generate market analysis for commercial SREC sales
   */
  private static generateMarketAnalysis(
    stateCode: string,
    systemSizeKW: number,
    _projectType: string
  ): CommercialSRECResult['marketAnalysis'] {
    const highValueStates = ['DC', 'MA', 'NJ', 'MD'];
    const emergingStates = ['IL', 'VA'];

    let analysis = {
      currentSupply: 'Moderate',
      demandTrend: 'Stable',
      priceVolatility: 'Low-Medium',
      recommendedSellTiming: 'Quarterly batches'
    };

    if (highValueStates.includes(stateCode)) {
      analysis = {
        currentSupply: 'High competition',
        demandTrend: 'Strong',
        priceVolatility: 'Medium',
        recommendedSellTiming: 'Lock in long-term contracts'
      };
    } else if (emergingStates.includes(stateCode)) {
      analysis = {
        currentSupply: 'Growing',
        demandTrend: 'Increasing',
        priceVolatility: 'Medium-High',
        recommendedSellTiming: 'Strategic timing around program changes'
      };
    }

    // Adjust for project scale
    if (systemSizeKW >= 5000) {
      analysis.recommendedSellTiming = 'Annual contracts with price floors';
    }

    return analysis;
  }

  /**
   * Analyze cross-state selling opportunities
   */
  private static analyzeCrossStateOptions(
    inputs: CommercialProjectInputs,
    homeSrecData: SRECStateData
  ): CommercialCrossStateOption[] {
    const options: CommercialCrossStateOption[] = [];
    const homeState = this.normalizeStateCode(inputs.state);

    if (!homeState) return options;

    // Check all eligible states
    const eligibleStates = [homeState];

    // Add cross-state eligible markets from home state
    if (homeSrecData.crossStateEligible) {
      eligibleStates.push(...homeSrecData.crossStateEligible);
    }

    // Check states that accept home state SRECs
    Object.entries(SREC_STATES).forEach(([code, data]) => {
      if (code !== homeState && data.notes?.includes(homeState)) {
        eligibleStates.push(code);
      }
    });

    // Calculate options for each eligible state
    eligibleStates.forEach(stateCode => {
      if (stateCode !== homeState) {
        const stateData = getSRECData(stateCode);
        if (stateData) {
          const scaleFactor = this.getCommercialScaleFactor(inputs.systemSizeKW, inputs.projectType);
          const annualSRECs = inputs.annualProductionKWH / 1000;
          const annualIncome = annualSRECs * stateData.value * scaleFactor;

          // Estimate transportation/transaction costs for cross-state sales
          const transportationCost = this.estimateTransportationCost(homeState, stateCode, inputs.systemSizeKW);
          const netBenefit = annualIncome - transportationCost;

          // Risk factor based on regulatory stability
          const riskFactor = this.assessCrossStateRisk(stateCode);

          // Recommendation score (higher is better)
          const recommendationScore = (netBenefit / 1000) * (1 - riskFactor);

          options.push({
            state: stateCode,
            stateName: stateData.name,
            annualIncome: Math.round(annualIncome),
            transportationCost: Math.round(transportationCost),
            netBenefit: Math.round(netBenefit),
            riskFactor,
            recommendationScore
          });
        }
      }
    });

    return options.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  /**
   * Find the best market recommendation
   */
  private static findBestMarket(options: CommercialCrossStateOption[]): string {
    if (options.length === 0) return 'Sell in home state market';

    const bestOption = options[0];
    if (bestOption && bestOption.recommendationScore > 50) {
      return `Consider ${bestOption.stateName} market for ${((bestOption.netBenefit / bestOption.annualIncome) * 100).toFixed(1)}% higher net returns`;
    }

    return 'Home state market recommended';
  }

  /**
   * Calculate levelized SREC value ($/MWh over project life)
   */
  private static calculateLevelizedSRECValue(annualIncome: number, years: number): number {
    // Simple levelized calculation (could be enhanced with NPV)
    const totalIncome = annualIncome * years;
    const totalMWh = years; // Normalized per MWh per year
    return Math.round(totalIncome / totalMWh);
  }

  /**
   * Estimate transportation/transaction costs for cross-state sales
   */
  private static estimateTransportationCost(homeState: string, targetState: string, systemSizeKW: number): number {
    // Base transaction cost
    let baseCost = 500; // Fixed annual cost for cross-state transactions

    // Scale with system size
    baseCost += systemSizeKW * 0.1;

    // Geographic factors (simplified)
    const adjacentStates: Record<string, string[]> = {
      'PA': ['OH', 'WV', 'MD', 'NJ'],
      'OH': ['PA', 'WV', 'IN', 'KY', 'MI'],
      'MD': ['PA', 'VA', 'DC', 'DE'],
      'VA': ['MD', 'DC'],
      'NJ': ['PA'],
      'DE': ['MD', 'PA']
    };

    const isAdjacent = adjacentStates[homeState]?.includes(targetState);
    if (!isAdjacent) {
      baseCost *= 1.5; // 50% premium for non-adjacent states
    }

    return baseCost;
  }

  /**
   * Assess regulatory risk for cross-state sales
   */
  private static assessCrossStateRisk(stateCode: string): number {
    // Risk factors based on market maturity and regulatory stability
    const riskFactors: Record<string, number> = {
      'DC': 0.1,  // Very stable, high-value market
      'MA': 0.15, // Stable but transitioning programs
      'MD': 0.2,  // Mature market
      'NJ': 0.25, // Volatile pricing
      'PA': 0.3,  // Accepts many states but lower prices
      'VA': 0.35, // Newer program
      'IL': 0.4,  // New program, M-RETS complexity
      'OH': 0.45, // Low prices, uncertain future
      'DE': 0.3,  // Small but stable
      'IN': 0.5,  // Limited program
      'KY': 0.5,  // Limited program
      'MI': 0.5,  // Limited program
      'WV': 0.5   // Limited program
    };

    return riskFactors[stateCode] || 0.6; // Default higher risk for unknown
  }

  /**
   * Generate commercial-specific notes
   */
  private static generateCommercialNotes(stateCode: string, projectType: string, systemSizeKW: number): string[] {
    const notes: string[] = [];

    // Scale-specific notes
    if (systemSizeKW >= 5000) {
      notes.push('Utility-scale pricing advantages available');
      notes.push('Consider long-term contracting strategies');
    } else if (systemSizeKW >= 1000) {
      notes.push('Commercial-scale volume bonuses apply');
    }

    // Project type notes
    if (projectType === 'community_solar') {
      notes.push('Community solar programs may have additional SREC benefits');
    }

    // State-specific commercial notes
    if (stateCode === 'IL') {
      notes.push('M-RETS compliance required for Illinois Shines program');
      notes.push('Consider block pricing structure impacts');
    } else if (stateCode === 'MA') {
      notes.push('SMART program has declining block pricing');
      notes.push('Energy storage adder opportunities available');
    } else if (stateCode === 'NJ') {
      notes.push('SREC-II program has price volatility');
      notes.push('Consider SREC financing products');
    }

    return notes;
  }

  /**
   * Normalize state input to state code
   */
  private static normalizeStateCode(state: string): string | null {
    if (!state) return null;
    if (state.length === 2) return state.toUpperCase();

    const stateCodes: Record<string, string> = {
      'delaware': 'DE', 'illinois': 'IL', 'indiana': 'IN', 'kentucky': 'KY',
      'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'new jersey': 'NJ',
      'ohio': 'OH', 'pennsylvania': 'PA', 'virginia': 'VA', 'washington dc': 'DC',
      'district of columbia': 'DC', 'west virginia': 'WV'
    };

    return stateCodes[state.toLowerCase().trim()] || null;
  }

  /**
   * Calculate ROI impact of SRECs on commercial project
   */
  static calculateCommercialROI(
    projectCost: number,
    annualElectricitySavings: number,
    srecResult: CommercialSRECResult,
    incentives: number = 0
  ): {
    baseROI: number;
    srecEnhancedROI: number;
    roiImprovement: number;
    paybackReduction: number;
  } {
    const netCost = projectCost - incentives - srecResult.acceleratedDepreciation.totalTaxBenefit;
    const totalAnnualBenefit = annualElectricitySavings + srecResult.annualSRECIncome;

    const baseROI = (annualElectricitySavings / netCost) * 100;
    const enhancedROI = (totalAnnualBenefit / netCost) * 100;
    const roiImprovement = enhancedROI - baseROI;

    const basePayback = netCost / annualElectricitySavings;
    const enhancedPayback = netCost / totalAnnualBenefit;
    const paybackReduction = basePayback - enhancedPayback;

    return {
      baseROI: Math.round(baseROI * 10) / 10,
      srecEnhancedROI: Math.round(enhancedROI * 10) / 10,
      roiImprovement: Math.round(roiImprovement * 10) / 10,
      paybackReduction: Math.round(paybackReduction * 10) / 10
    };
  }
}