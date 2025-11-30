// Comprehensive state-specific solar and battery pricing data
// Based on 2024 market research and installer averages

export interface StatePricing {
  state: string
  stateName: string
  avgSystemCost: number      // Average cost for 7kW system
  costPerWatt: number        // $ per watt installed
  batteryPriceRange: {       // Battery storage costs
    low: number              // Single battery (10-13 kWh)
    high: number             // Dual battery (20-26 kWh)
  }
  utilityRate: number        // Average $/kWh
  utilityProvider?: string   // Major utility provider
  laborCostIndex: number     // Relative to national average (1.0)
  incentives?: string        // State-specific incentives
  maxSystemSize?: number     // Maximum system size in kW (net metering limits)
}

export const statePricing: Record<string, StatePricing> = {
  'AL': {
    state: 'AL',
    stateName: 'Alabama',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.13,
    utilityProvider: 'Alabama Power',
    laborCostIndex: 0.85
  },
  'AK': {
    state: 'AK',
    stateName: 'Alaska',
    avgSystemCost: 23100,
    costPerWatt: 3.30,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.23,
    utilityProvider: 'Chugach Electric',
    laborCostIndex: 1.25
  },
  'AZ': {
    state: 'AZ',
    stateName: 'Arizona',
    avgSystemCost: 18200,
    costPerWatt: 2.60,
    batteryPriceRange: { low: 10500, high: 19000 },
    utilityRate: 0.13,
    utilityProvider: 'APS (Arizona Public Service)',
    laborCostIndex: 0.95,
    incentives: 'State tax credit up to $1,000'
  },
  'AR': {
    state: 'AR',
    stateName: 'Arkansas',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Entergy Arkansas',
    laborCostIndex: 0.85
  },
  'CA': {
    state: 'CA',
    stateName: 'California',
    avgSystemCost: 28000,
    costPerWatt: 4.00,
    batteryPriceRange: { low: 15000, high: 30000 },
    utilityRate: 0.30,
    utilityProvider: 'PG&E',
    laborCostIndex: 1.35,
    incentives: 'SGIP battery rebates, NEM 3.0',
    maxSystemSize: 10  // CA residential net metering limit
  },
  'CO': {
    state: 'CO',
    stateName: 'Colorado',
    avgSystemCost: 21000,
    costPerWatt: 3.00,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.13,
    utilityProvider: 'Xcel Energy',
    laborCostIndex: 1.05
  },
  'CT': {
    state: 'CT',
    stateName: 'Connecticut',
    avgSystemCost: 23800,
    costPerWatt: 3.40,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.22,
    utilityProvider: 'Eversource',
    laborCostIndex: 1.15,
    incentives: 'Green Bank financing available'
  },
  'DE': {
    state: 'DE',
    stateName: 'Delaware',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.13,
    utilityProvider: 'Delmarva Power',
    laborCostIndex: 1.05
  },
  'DC': {
    state: 'DC',
    stateName: 'District of Columbia',
    avgSystemCost: 24500,
    costPerWatt: 3.50,
    batteryPriceRange: { low: 14000, high: 25000 },
    utilityRate: 0.13,
    utilityProvider: 'Pepco',
    laborCostIndex: 1.20,
    incentives: 'Solar for All program'
  },
  'FL': {
    state: 'FL',
    stateName: 'Florida',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.13,
    utilityProvider: 'Florida Power & Light (FPL)',
    laborCostIndex: 0.95,
    incentives: 'Property tax exemption'
  },
  'GA': {
    state: 'GA',
    stateName: 'Georgia',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.13,
    utilityProvider: 'Georgia Power',
    laborCostIndex: 0.90
  },
  'HI': {
    state: 'HI',
    stateName: 'Hawaii',
    avgSystemCost: 26600,
    costPerWatt: 3.80,
    batteryPriceRange: { low: 15000, high: 28000 },
    utilityRate: 0.33,
    utilityProvider: 'Hawaiian Electric (HECO)',
    laborCostIndex: 1.40,
    incentives: 'State tax credit 35%'
  },
  'ID': {
    state: 'ID',
    stateName: 'Idaho',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.10,
    utilityProvider: 'Idaho Power',
    laborCostIndex: 0.90
  },
  'IL': {
    state: 'IL',
    stateName: 'Illinois',
    avgSystemCost: 21700,
    costPerWatt: 3.10,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.13,
    utilityProvider: 'ComEd',
    laborCostIndex: 1.05,
    incentives: 'Illinois Shines program'
  },
  'IN': {
    state: 'IN',
    stateName: 'Indiana',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.12,
    utilityProvider: 'Duke Energy Indiana',
    laborCostIndex: 0.95
  },
  'IA': {
    state: 'IA',
    stateName: 'Iowa',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.12,
    utilityProvider: 'MidAmerican Energy',
    laborCostIndex: 0.95,
    incentives: 'State tax credit'
  },
  'KS': {
    state: 'KS',
    stateName: 'Kansas',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.13,
    utilityProvider: 'Evergy',
    laborCostIndex: 0.90
  },
  'KY': {
    state: 'KY',
    stateName: 'Kentucky',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Louisville Gas & Electric (LG&E)',
    laborCostIndex: 0.85
  },
  'LA': {
    state: 'LA',
    stateName: 'Louisiana',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Entergy Louisiana',
    laborCostIndex: 0.90
  },
  'ME': {
    state: 'ME',
    stateName: 'Maine',
    avgSystemCost: 22400,
    costPerWatt: 3.20,
    batteryPriceRange: { low: 12500, high: 23000 },
    utilityRate: 0.17,
    utilityProvider: 'Central Maine Power',
    laborCostIndex: 1.10
  },
  'MD': {
    state: 'MD',
    stateName: 'Maryland',
    avgSystemCost: 21700,
    costPerWatt: 3.10,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.13,
    utilityProvider: 'BGE (Baltimore Gas & Electric)',
    laborCostIndex: 1.10,
    incentives: 'State grant program'
  },
  'MA': {
    state: 'MA',
    stateName: 'Massachusetts',
    avgSystemCost: 24500,
    costPerWatt: 3.50,
    batteryPriceRange: { low: 14000, high: 25000 },
    utilityRate: 0.23,
    utilityProvider: 'National Grid',
    laborCostIndex: 1.20,
    incentives: 'SMART program, ConnectedSolutions'
  },
  'MI': {
    state: 'MI',
    stateName: 'Michigan',
    avgSystemCost: 21000,
    costPerWatt: 3.00,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.17,
    utilityProvider: 'DTE Energy',
    laborCostIndex: 1.00
  },
  'MN': {
    state: 'MN',
    stateName: 'Minnesota',
    avgSystemCost: 21700,
    costPerWatt: 3.10,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.13,
    utilityProvider: 'Xcel Energy',
    laborCostIndex: 1.05,
    incentives: 'Solar*Rewards program'
  },
  'MS': {
    state: 'MS',
    stateName: 'Mississippi',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.12,
    utilityProvider: 'Mississippi Power',
    laborCostIndex: 0.85
  },
  'MO': {
    state: 'MO',
    stateName: 'Missouri',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Ameren Missouri',
    laborCostIndex: 0.90
  },
  'MT': {
    state: 'MT',
    stateName: 'Montana',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.11,
    utilityProvider: 'NorthWestern Energy',
    laborCostIndex: 0.95
  },
  'NE': {
    state: 'NE',
    stateName: 'Nebraska',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Omaha Public Power District (OPPD)',
    laborCostIndex: 0.90
  },
  'NV': {
    state: 'NV',
    stateName: 'Nevada',
    avgSystemCost: 18200,
    costPerWatt: 2.60,
    batteryPriceRange: { low: 10500, high: 19000 },
    utilityRate: 0.12,
    utilityProvider: 'NV Energy',
    laborCostIndex: 1.00
  },
  'NH': {
    state: 'NH',
    stateName: 'New Hampshire',
    avgSystemCost: 23100,
    costPerWatt: 3.30,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.20,
    utilityProvider: 'Eversource',
    laborCostIndex: 1.15
  },
  'NJ': {
    state: 'NJ',
    stateName: 'New Jersey',
    avgSystemCost: 23100,
    costPerWatt: 3.30,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.16,
    utilityProvider: 'PSE&G',
    laborCostIndex: 1.15,
    incentives: 'SRECs, Successor Solar Incentive'
  },
  'NM': {
    state: 'NM',
    stateName: 'New Mexico',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.13,
    utilityProvider: 'PNM (Public Service Company of New Mexico)',
    laborCostIndex: 0.95,
    incentives: 'State tax credit 10%'
  },
  'NY': {
    state: 'NY',
    stateName: 'New York',
    avgSystemCost: 24500,
    costPerWatt: 3.50,
    batteryPriceRange: { low: 14000, high: 25000 },
    utilityRate: 0.22,
    utilityProvider: 'Con Edison',
    laborCostIndex: 1.25,
    incentives: 'NY-Sun program, tax credit'
  },
  'NC': {
    state: 'NC',
    stateName: 'North Carolina',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.12,
    utilityProvider: 'Duke Energy Carolinas',
    laborCostIndex: 0.90,
    incentives: 'Duke Energy rebates'
  },
  'ND': {
    state: 'ND',
    stateName: 'North Dakota',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.10,
    utilityProvider: 'Xcel Energy',
    laborCostIndex: 0.95
  },
  'OH': {
    state: 'OH',
    stateName: 'Ohio',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.13,
    utilityProvider: 'AEP Ohio',
    laborCostIndex: 0.95
  },
  'OK': {
    state: 'OK',
    stateName: 'Oklahoma',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'OG&E',
    laborCostIndex: 0.85
  },
  'OR': {
    state: 'OR',
    stateName: 'Oregon',
    avgSystemCost: 21700,
    costPerWatt: 3.10,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.11,
    utilityProvider: 'Portland General Electric (PGE)',
    laborCostIndex: 1.10,
    incentives: 'Solar + Storage Rebate Program'
  },
  'PA': {
    state: 'PA',
    stateName: 'Pennsylvania',
    avgSystemCost: 21700,
    costPerWatt: 3.10,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.14,
    utilityProvider: 'PECO',
    laborCostIndex: 1.00
  },
  'PR': {
    state: 'PR',
    stateName: 'Puerto Rico',
    avgSystemCost: 21000,
    costPerWatt: 3.00,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.22,
    utilityProvider: 'LUMA Energy',
    laborCostIndex: 0.90,
    incentives: 'Net metering available'
  },
  'RI': {
    state: 'RI',
    stateName: 'Rhode Island',
    avgSystemCost: 23800,
    costPerWatt: 3.40,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.22,
    utilityProvider: 'Rhode Island Energy',
    laborCostIndex: 1.15,
    incentives: 'REF program'
  },
  'SC': {
    state: 'SC',
    stateName: 'South Carolina',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.13,
    utilityProvider: 'Dominion Energy SC',
    laborCostIndex: 0.90,
    incentives: 'State tax credit 25%'
  },
  'SD': {
    state: 'SD',
    stateName: 'South Dakota',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.12,
    utilityProvider: 'Black Hills Energy',
    laborCostIndex: 0.90
  },
  'TN': {
    state: 'TN',
    stateName: 'Tennessee',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'TVA (Tennessee Valley Authority)',
    laborCostIndex: 0.85
  },
  'TX': {
    state: 'TX',
    stateName: 'Texas',
    avgSystemCost: 18200,
    costPerWatt: 2.60,
    batteryPriceRange: { low: 10500, high: 19000 },
    utilityRate: 0.12,
    utilityProvider: 'Oncor',
    laborCostIndex: 0.90,
    incentives: 'Property tax exemption'
  },
  'UT': {
    state: 'UT',
    stateName: 'Utah',
    avgSystemCost: 18900,
    costPerWatt: 2.70,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.10,
    utilityProvider: 'Rocky Mountain Power',
    laborCostIndex: 0.95,
    incentives: 'State tax credit'
  },
  'VT': {
    state: 'VT',
    stateName: 'Vermont',
    avgSystemCost: 23100,
    costPerWatt: 3.30,
    batteryPriceRange: { low: 13000, high: 24000 },
    utilityRate: 0.18,
    utilityProvider: 'Green Mountain Power',
    laborCostIndex: 1.10
  },
  'VA': {
    state: 'VA',
    stateName: 'Virginia',
    avgSystemCost: 20300,
    costPerWatt: 2.90,
    batteryPriceRange: { low: 11500, high: 21000 },
    utilityRate: 0.12,
    utilityProvider: 'Dominion Energy Virginia',
    laborCostIndex: 1.00
  },
  'WA': {
    state: 'WA',
    stateName: 'Washington',
    avgSystemCost: 21000,
    costPerWatt: 3.00,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.10,
    utilityProvider: 'Puget Sound Energy (PSE)',
    laborCostIndex: 1.15,
    incentives: 'Sales tax exemption'
  },
  'WV': {
    state: 'WV',
    stateName: 'West Virginia',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.12,
    utilityProvider: 'Appalachian Power',
    laborCostIndex: 0.85
  },
  'WI': {
    state: 'WI',
    stateName: 'Wisconsin',
    avgSystemCost: 21000,
    costPerWatt: 3.00,
    batteryPriceRange: { low: 12000, high: 22000 },
    utilityRate: 0.15,
    utilityProvider: 'We Energies',
    laborCostIndex: 1.00
  },
  'WY': {
    state: 'WY',
    stateName: 'Wyoming',
    avgSystemCost: 19600,
    costPerWatt: 2.80,
    batteryPriceRange: { low: 11000, high: 20000 },
    utilityRate: 0.11,
    utilityProvider: 'Rocky Mountain Power',
    laborCostIndex: 0.90
  }
}

// Helper function to get pricing for a state
export function getStatePricing(stateCode: string): StatePricing {
  const pricing = statePricing[stateCode.toUpperCase()]
  if (!pricing) {
    // Return US average as default
    return {
      state: 'US',
      stateName: 'United States Average',
      avgSystemCost: 20000,
      costPerWatt: 2.85,
      batteryPriceRange: { low: 11500, high: 21000 },
      utilityRate: 0.15,
      laborCostIndex: 1.0
    }
  }
  return pricing
}

// Get system cost for specific size
export function getSystemCost(stateCode: string, systemSizeKW: number): number {
  const pricing = getStatePricing(stateCode)
  return Math.round(systemSizeKW * 1000 * pricing.costPerWatt)
}