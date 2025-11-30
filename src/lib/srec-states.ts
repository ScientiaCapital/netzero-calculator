// SREC State Data and Associations
export interface SRECAssociation {
  name: string;
  url: string;
}

export interface SRECStateData {
  name: string;
  program: string;
  value: number;          // Average $/SREC
  valueRange: [number, number]; // Min-Max range
  years: number;          // Eligibility period
  productionFactor: number; // SRECs per kW per year
  associations: SRECAssociation[];
  crossStateEligible?: string[]; // States that accept this state's SRECs
  mrets?: boolean;        // Uses M-RETS system (IL specific)
  notes?: string;
}

export const SREC_STATES: Record<string, SRECStateData> = {
  DE: {
    name: "Delaware",
    program: "Delaware SREC",
    value: 30,
    valueRange: [20, 40],
    years: 20,
    productionFactor: 1.3,
    associations: [
      { name: "Solar Delaware", url: "https://solardelaware.org/" },
      { name: "MSSIA", url: "https://mssia.org/" }
    ]
  },
  
  IL: {
    name: "Illinois",
    program: "Illinois Shines",
    value: 80,
    valueRange: [70, 90],
    years: 15,
    productionFactor: 1.2,
    mrets: true,
    associations: [
      { name: "Illinois Solar Energy Association", url: "https://illinoissolar.org/" },
      { name: "Midwest Renewable Energy Association", url: "https://midwestrenew.org/" }
    ],
    notes: "M-RETS compliance required"
  },
  
  IN: {
    name: "Indiana",
    program: "Indiana SREC",
    value: 20,
    valueRange: [10, 30],
    years: 15,
    productionFactor: 1.2,
    crossStateEligible: ["OH"],
    associations: [
      { name: "Indiana Renewable Energy Association", url: "http://www.indianadg.net/indiana-renewable-energy-association-inrea/" },
      { name: "IndianaDG", url: "http://www.indianadg.net/" }
    ]
  },
  
  KY: {
    name: "Kentucky",
    program: "Kentucky SREC",
    value: 15,
    valueRange: [10, 20],
    years: 15,
    productionFactor: 1.3,
    crossStateEligible: ["OH"],
    associations: [
      { name: "Kentucky Solar Energy Society", url: "https://www.kyses.org/" },
      { name: "KYSEIA", url: "https://kyseia.org/" }
    ]
  },
  
  MD: {
    name: "Maryland",
    program: "Maryland SREC",
    value: 65,
    valueRange: [50, 80],
    years: 20,
    productionFactor: 1.3,
    associations: [
      { name: "Maryland Clean Energy Center", url: "https://www.mdcleanenergy.org/" },
      { name: "ChESSA", url: "https://chessa.org/" }
    ]
  },
  
  MA: {
    name: "Massachusetts",
    program: "SMART Program",
    value: 250,
    valueRange: [200, 300],
    years: 10,
    productionFactor: 1.1,
    associations: [
      { name: "NESEA", url: "https://nesea.org/" }
    ],
    notes: "Solar Massachusetts Renewable Target program"
  },
  
  MI: {
    name: "Michigan",
    program: "Michigan SREC",
    value: 20,
    valueRange: [10, 30],
    years: 15,
    productionFactor: 1.1,
    crossStateEligible: ["OH"],
    associations: [
      { name: "MREA", url: "https://midwestrenew.org/" }
    ]
  },
  
  NJ: {
    name: "New Jersey",
    program: "SREC-II",
    value: 125,
    valueRange: [50, 200],
    years: 15,
    productionFactor: 1.2,
    associations: [
      { name: "MSSIA", url: "https://mssia.org/" },
      { name: "New Jersey Energy Coalition", url: "https://www.njenergycoalition.org/" }
    ],
    notes: "Declining SREC values over time"
  },
  
  OH: {
    name: "Ohio",
    program: "Ohio SREC",
    value: 7,
    valueRange: [4, 10],
    years: 15,
    productionFactor: 1.2,
    crossStateEligible: ["PA"],
    associations: [
      { name: "SEIA Ohio", url: "https://seia.org/" }
    ],
    notes: "Can sell into PA market for better returns"
  },
  
  PA: {
    name: "Pennsylvania",
    program: "Pennsylvania SREC",
    value: 15,
    valueRange: [10, 20],
    years: 15,
    productionFactor: 1.2,
    associations: [
      { name: "MSSIA", url: "https://mssia.org/" }
    ],
    notes: "Accepts SRECs from OH, IN, KY, WV"
  },
  
  VA: {
    name: "Virginia",
    program: "Virginia SREC",
    value: 50,
    valueRange: [40, 60],
    years: 15,
    productionFactor: 1.3,
    associations: [
      { name: "ChESSA", url: "https://chessa.org/" }
    ]
  },
  
  DC: {
    name: "Washington DC",
    program: "DC SREC",
    value: 350,
    valueRange: [300, 400],
    years: 15,
    productionFactor: 1.3,
    associations: [
      { name: "ChESSA", url: "https://chessa.org/" }
    ],
    notes: "Highest SREC values nationally"
  },
  
  WV: {
    name: "West Virginia",
    program: "WV SREC",
    value: 15,
    valueRange: [10, 20],
    years: 15,
    productionFactor: 1.2,
    crossStateEligible: ["OH", "PA"],
    associations: [
      { name: "SEIA", url: "https://seia.org/" }
    ]
  }
};

// Helper function to check if a state has SREC program
export function isSRECState(stateCode: string): boolean {
  return stateCode in SREC_STATES;
}

// Get SREC data for a state
export function getSRECData(stateCode: string): SRECStateData | null {
  return SREC_STATES[stateCode] || null;
}

// Get states where this state's SRECs can be sold
export function getCrossStateOptions(stateCode: string): string[] {
  const stateData = SREC_STATES[stateCode];
  if (!stateData) return [];
  
  const options = [stateCode]; // Can always sell in home state
  
  // Add cross-state eligible markets
  if (stateData.crossStateEligible) {
    options.push(...stateData.crossStateEligible);
  }
  
  // Check if other states accept this state's SRECs
  Object.entries(SREC_STATES).forEach(([code, data]) => {
    if (code !== stateCode && data.notes?.includes(stateCode)) {
      options.push(code);
    }
  });
  
  return [...new Set(options)]; // Remove duplicates
}

// State code mapping for common state names
export const STATE_CODES: Record<string, string> = {
  'delaware': 'DE',
  'illinois': 'IL',
  'indiana': 'IN',
  'kentucky': 'KY',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'new jersey': 'NJ',
  'ohio': 'OH',
  'pennsylvania': 'PA',
  'virginia': 'VA',
  'washington dc': 'DC',
  'district of columbia': 'DC',
  'west virginia': 'WV'
};