// Solar Roof Engineering Calculations
// Real-world panel placement with setbacks, spacing, and obstructions

export interface PanelDimensions {
  lengthInches: number;
  widthInches: number;
  lengthFeet: number;
  widthFeet: number;
  lengthMeters: number;
  widthMeters: number;
  areaSquareFeet: number;
  areaSquareMeters: number;
  watts: number;
}

export interface RoofSetbacks {
  fireSetbackFeet: number;        // Required fire department setback
  edgeSetbackFeet: number;        // Edge safety setback
  obstructionSetbackFeet: number; // Around vents, chimneys, etc.
  walkwayWidthFeet: number;       // Required walkway width
}

export interface PanelSpacing {
  rowSpacingFeet: number;         // Between panel rows
  columnSpacingFeet: number;      // Between panel columns
  tileDegrees: number;            // Panel tilt angle
  shadingFactorMultiplier: number; // Row spacing for no shading
}

export interface UsableRoofArea {
  totalRoofAreaSqFt: number;
  setbackAreaLossSqFt: number;
  obstructionAreaLossSqFt: number;
  spacingAreaLossSqFt: number;
  usableAreaSqFt: number;
  usableAreaPercentage: number;
}

export interface EngineeringResult {
  panelSpecs: PanelDimensions;
  roofSetbacks: RoofSetbacks;
  panelSpacing: PanelSpacing;
  usableArea: UsableRoofArea;
  maxPanelsEngineered: number;
  maxSystemSizeKW: number;
  googleEstimate: number;
  engineeringReduction: number;
  engineeringEfficiency: number;
}

// Standard 400W panel dimensions (industry standard)
export const STANDARD_400W_PANEL: PanelDimensions = {
  lengthInches: 79,           // 79 inches
  widthInches: 39,            // 39 inches  
  lengthFeet: 79 / 12,        // 6.58 feet
  widthFeet: 39 / 12,         // 3.25 feet
  lengthMeters: 79 * 0.0254,  // 2.0 meters
  widthMeters: 39 * 0.0254,   // 1.0 meters
  areaSquareFeet: (79 * 39) / 144, // 21.4 sq ft
  areaSquareMeters: (79 * 39) * 0.00064516, // 2.0 sq meters
  watts: 400
};

// Standard setback requirements (varies by jurisdiction)
export const STANDARD_SETBACKS: RoofSetbacks = {
  fireSetbackFeet: 3,         // NEC 690.31 - 3 feet from roof edge
  edgeSetbackFeet: 1,         // Additional safety margin
  obstructionSetbackFeet: 1,  // Around vents, chimneys
  walkwayWidthFeet: 3         // Required walkway width
};

// Panel spacing for optimal performance
export const STANDARD_SPACING: PanelSpacing = {
  rowSpacingFeet: 2,          // 2 feet between rows (varies by tilt)
  columnSpacingFeet: 0.5,     // 6 inches between columns
  tileDegrees: 25,            // Optimal tilt angle (varies by latitude)
  shadingFactorMultiplier: 2.5 // Row spacing = panel height × this factor
};

export class SolarRoofEngineer {
  
  /**
   * Calculate real-world panel capacity with engineering constraints
   */
  static calculateEngineeredCapacity(
    googleRoofAreaSqFt: number,
    googleMaxPanels: number,
    latitude?: number
  ): EngineeringResult {
    
    const panelSpecs = STANDARD_400W_PANEL;
    const setbacks = STANDARD_SETBACKS;
    const spacing = this.calculateOptimalSpacing(latitude);
    
    // Calculate usable roof area after setbacks
    const usableArea = this.calculateUsableRoofArea(googleRoofAreaSqFt, setbacks);
    
    // Calculate maximum panels with proper spacing
    const maxPanelsEngineered = this.calculateMaxPanelsWithSpacing(
      usableArea.usableAreaSqFt,
      panelSpecs,
      spacing
    );
    
    const maxSystemSizeKW = (maxPanelsEngineered * panelSpecs.watts) / 1000;
    const engineeringReduction = googleMaxPanels - maxPanelsEngineered;
    const engineeringEfficiency = maxPanelsEngineered / googleMaxPanels;
    
    return {
      panelSpecs,
      roofSetbacks: setbacks,
      panelSpacing: spacing,
      usableArea,
      maxPanelsEngineered,
      maxSystemSizeKW,
      googleEstimate: googleMaxPanels,
      engineeringReduction,
      engineeringEfficiency
    };
  }
  
  /**
   * Calculate optimal panel spacing based on latitude and tilt
   */
  static calculateOptimalSpacing(latitude?: number): PanelSpacing {
    const spacing = { ...STANDARD_SPACING };
    
    if (latitude) {
      // Optimal tilt ≈ latitude (simplified)
      spacing.tileDegrees = Math.min(Math.max(latitude, 15), 45);
      
      // Row spacing increases with tilt to prevent shading
      const tiltRadians = (spacing.tileDegrees * Math.PI) / 180;
      const panelHeightFeet = STANDARD_400W_PANEL.lengthFeet;
      spacing.rowSpacingFeet = panelHeightFeet * Math.sin(tiltRadians) * spacing.shadingFactorMultiplier;
    }
    
    return spacing;
  }
  
  /**
   * Calculate usable roof area after setbacks and obstructions
   */
  static calculateUsableRoofArea(
    totalRoofAreaSqFt: number,
    setbacks: RoofSetbacks
  ): UsableRoofArea {
    
    // Estimate roof dimensions (assuming rectangular for simplicity)
    const roofSideLength = Math.sqrt(totalRoofAreaSqFt);
    
    // Calculate perimeter setback loss
    const perimeterSetbackFeet = setbacks.fireSetbackFeet + setbacks.edgeSetbackFeet;
    const usableLength = Math.max(0, roofSideLength - (2 * perimeterSetbackFeet));
    const usableWidth = Math.max(0, roofSideLength - (2 * perimeterSetbackFeet));
    const usableAreaAfterSetbacks = usableLength * usableWidth;
    
    // Estimate obstruction losses (5-15% typical)
    const obstructionLossPercent = 0.10; // 10% for vents, chimneys, etc.
    const obstructionAreaLoss = usableAreaAfterSetbacks * obstructionLossPercent;
    
    // Calculate spacing losses (varies by layout)
    const spacingLossPercent = 0.05; // 5% for inter-panel spacing
    const spacingAreaLoss = usableAreaAfterSetbacks * spacingLossPercent;
    
    const setbackAreaLoss = totalRoofAreaSqFt - usableAreaAfterSetbacks;
    const finalUsableArea = usableAreaAfterSetbacks - obstructionAreaLoss - spacingAreaLoss;
    
    return {
      totalRoofAreaSqFt,
      setbackAreaLossSqFt: setbackAreaLoss,
      obstructionAreaLossSqFt: obstructionAreaLoss,
      spacingAreaLossSqFt: spacingAreaLoss,
      usableAreaSqFt: Math.max(0, finalUsableArea),
      usableAreaPercentage: (finalUsableArea / totalRoofAreaSqFt) * 100
    };
  }
  
  /**
   * Calculate maximum panels with proper spacing in usable area
   */
  static calculateMaxPanelsWithSpacing(
    usableAreaSqFt: number,
    panelSpecs: PanelDimensions,
    spacing: PanelSpacing
  ): number {
    
    // Panel dimensions including spacing
    const panelWithSpacingLength = panelSpecs.lengthFeet + spacing.rowSpacingFeet;
    const panelWithSpacingWidth = panelSpecs.widthFeet + spacing.columnSpacingFeet;
    const panelWithSpacingArea = panelWithSpacingLength * panelWithSpacingWidth;
    
    // Calculate theoretical maximum
    const theoreticalMaxPanels = Math.floor(usableAreaSqFt / panelWithSpacingArea);
    
    // Apply layout efficiency factor (not all areas can be perfectly filled)
    const layoutEfficiency = 0.85; // 85% efficiency due to rectangular constraints
    
    return Math.floor(theoreticalMaxPanels * layoutEfficiency);
  }
  
  /**
   * Generate engineering summary for display
   */
  static generateEngineeringSummary(result: EngineeringResult): string {
    const efficiency = (result.engineeringEfficiency * 100).toFixed(1);
    const reduction = result.engineeringReduction;
    
    return `
🏗️ ENGINEERING ANALYSIS:
• Google Estimate: ${result.googleEstimate} panels
• Engineering Reality: ${result.maxPanelsEngineered} panels (${efficiency}% of max)
• System Size: ${result.maxSystemSizeKW.toFixed(1)} kW
• Reduction Factor: ${reduction} panels due to setbacks & spacing

📏 ROOF UTILIZATION:
• Total Roof Area: ${result.usableArea.totalRoofAreaSqFt.toFixed(0)} sq ft
• Usable Area: ${result.usableArea.usableAreaSqFt.toFixed(0)} sq ft (${result.usableArea.usableAreaPercentage.toFixed(1)}%)
• Setback Loss: ${result.usableArea.setbackAreaLossSqFt.toFixed(0)} sq ft
• Obstruction Loss: ${result.usableArea.obstructionAreaLossSqFt.toFixed(0)} sq ft

⚡ PANEL SPECIFICATIONS:
• Panel Size: ${result.panelSpecs.lengthFeet.toFixed(1)}' × ${result.panelSpecs.widthFeet.toFixed(1)}' (${result.panelSpecs.watts}W)
• Panel Area: ${result.panelSpecs.areaSquareFeet.toFixed(1)} sq ft each
• Required Setbacks: ${result.roofSetbacks.fireSetbackFeet}' fire code + ${result.roofSetbacks.edgeSetbackFeet}' safety
• Row Spacing: ${result.panelSpacing.rowSpacingFeet.toFixed(1)}' (${result.panelSpacing.tileDegrees}° tilt)
    `.trim();
  }
}

// Enhanced Solar Insights with Engineering
export interface EnhancedSolarInsights {
  googleData: {
    maxPanels: number;
    roofAreaSqFt: number;
    roofAreaM2: number;
    sunshineHours: number;
  };
  engineeringAnalysis: EngineeringResult;
  recommendedSystemSize: {
    panelCount: number;
    systemSizeKW: number;
    annualProductionKWH: number;
    roofUtilization: number;
  };
  summary: string;
}