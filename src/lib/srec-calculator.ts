import { getSRECData, getCrossStateOptions, isSRECState, STATE_CODES } from './srec-states';

export interface SRECCalculationResult {
  isEligible: boolean;
  state?: string;
  stateName?: string;
  programName?: string;
  annualProduction: number;      // kWh
  annualSRECs: number;           // SRECs per year
  srecValue: number;             // $/SREC
  annualIncome: number;          // Annual SREC income
  lifetimeIncome: number;        // Total SREC income over eligibility period
  eligibilityYears: number;
  monthlyIncome: number;         // Monthly SREC income
  associations?: Array<{name: string; url: string}>;
  crossStateOptions?: string[];
  notes?: string;
  // Illinois M-RETS specific (internal use)
  mrets?: boolean;
}

export class SRECCalculator {
  /**
   * Calculate SREC income based on system size and location
   */
  static calculateSRECIncome(
    _systemSizeKW: number,
    annualProductionKWH: number,
    state: string
  ): SRECCalculationResult {
    // Default result for non-SREC states
    const defaultResult: SRECCalculationResult = {
      isEligible: false,
      annualProduction: annualProductionKWH,
      annualSRECs: 0,
      srecValue: 0,
      annualIncome: 0,
      lifetimeIncome: 0,
      eligibilityYears: 0,
      monthlyIncome: 0
    };

    // Normalize state input
    const stateCode = this.normalizeStateCode(state);
    if (!stateCode || !isSRECState(stateCode)) {
      return defaultResult;
    }

    // Get SREC data for the state
    const srecData = getSRECData(stateCode);
    if (!srecData) {
      return defaultResult;
    }

    // Calculate annual SRECs (1 SREC = 1,000 kWh = 1 MWh)
    const annualSRECs = annualProductionKWH / 1000;

    // Calculate annual income
    const annualIncome = annualSRECs * srecData.value;

    // Calculate lifetime income
    const lifetimeIncome = annualIncome * srecData.years;

    // Get cross-state selling options
    const crossStateOptions = getCrossStateOptions(stateCode);

    return {
      isEligible: true,
      state: stateCode,
      stateName: srecData.name,
      programName: srecData.program,
      annualProduction: annualProductionKWH,
      annualSRECs: Math.round(annualSRECs * 10) / 10, // Round to 1 decimal
      srecValue: srecData.value,
      annualIncome: Math.round(annualIncome),
      lifetimeIncome: Math.round(lifetimeIncome),
      eligibilityYears: srecData.years,
      monthlyIncome: Math.round(annualIncome / 12),
      associations: srecData.associations,
      ...(crossStateOptions.length > 1 && { crossStateOptions }),
      ...(srecData.notes && { notes: srecData.notes }),
      ...(srecData.mrets !== undefined && { mrets: srecData.mrets })
    };
  }

  /**
   * Calculate the best SREC option if multiple states are available
   */
  static calculateBestSRECOption(
    systemSizeKW: number,
    annualProductionKWH: number,
    homeState: string
  ): SRECCalculationResult {
    const homeStateResult = this.calculateSRECIncome(systemSizeKW, annualProductionKWH, homeState);
    
    if (!homeStateResult.isEligible || !homeStateResult.crossStateOptions) {
      return homeStateResult;
    }

    let bestResult = homeStateResult;
    let bestValue = homeStateResult.annualIncome;

    // Check cross-state options for better value
    for (const stateOption of homeStateResult.crossStateOptions) {
      if (stateOption !== homeStateResult.state) {
        const optionResult = this.calculateSRECIncome(systemSizeKW, annualProductionKWH, stateOption);
        if (optionResult.annualIncome > bestValue) {
          bestValue = optionResult.annualIncome;
          bestResult = {
            ...optionResult,
            notes: `Best value: Sell ${homeState} SRECs in ${stateOption} market`
          };
        }
      }
    }

    return bestResult;
  }

  /**
   * Calculate the impact of SREC income on payback period
   */
  static calculatePaybackWithSREC(
    systemCost: number,
    annualElectricitySavings: number,
    srecAnnualIncome: number,
    incentives: number = 0
  ): {
    paybackWithoutSREC: number;
    paybackWithSREC: number;
    paybackReduction: number;
  } {
    const netCost = systemCost - incentives;
    const paybackWithoutSREC = netCost / annualElectricitySavings;
    const paybackWithSREC = netCost / (annualElectricitySavings + srecAnnualIncome);
    const paybackReduction = paybackWithoutSREC - paybackWithSREC;

    return {
      paybackWithoutSREC: Math.round(paybackWithoutSREC * 10) / 10,
      paybackWithSREC: Math.round(paybackWithSREC * 10) / 10,
      paybackReduction: Math.round(paybackReduction * 10) / 10
    };
  }

  /**
   * Normalize state input to state code
   */
  private static normalizeStateCode(state: string): string | null {
    if (!state) return null;

    // Already a state code
    if (state.length === 2) {
      return state.toUpperCase();
    }

    // Try to match state name
    const normalized = state.toLowerCase().trim();
    return STATE_CODES[normalized] || null;
  }

  /**
   * Get SREC educational content for display
   */
  static getSRECEducation(): {
    title: string;
    description: string;
    howItWorks: string[];
    sellingProcess: string[];
  } {
    return {
      title: "What are SRECs?",
      description: "Solar Renewable Energy Certificates (SRECs) are earned for every 1,000 kWh (1 MWh) of solar electricity your system produces. You can sell these certificates for additional income beyond your electricity savings.",
      howItWorks: [
        "Your solar system generates electricity",
        "For every 1,000 kWh produced, you earn 1 SREC",
        "SRECs are sold to utilities to meet renewable energy requirements",
        "You receive payment for each SREC sold"
      ],
      sellingProcess: [
        "Register your system with your state program",
        "Track production through monitoring",
        "Sell SRECs through a broker or aggregator",
        "Receive quarterly or annual payments"
      ]
    };
  }

  /**
   * Format SREC display text
   */
  static formatSRECDisplay(result: SRECCalculationResult): {
    incomeText: string;
    productionText: string;
    programText: string;
    valueText: string;
  } {
    if (!result.isEligible) {
      return {
        incomeText: "Not eligible for SREC income",
        productionText: "",
        programText: "",
        valueText: ""
      };
    }

    return {
      incomeText: `$${result.annualIncome.toLocaleString()}/year`,
      productionText: `${result.annualSRECs} SRECs/year`,
      programText: result.programName || "",
      valueText: `$${result.srecValue}/SREC`
    };
  }
}