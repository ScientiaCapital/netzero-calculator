/**
 * SolarCalculator Test Suite
 *
 * Tests the static SolarCalculator.calculate() API that provides
 * complete solar analysis including NREL integration and SREC calculations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SolarCalculator, SolarCalculationInput, SolarCalculationResult } from './calculations';

// Mock fetch for NREL API calls
const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;

// Mock NREL API response
const mockNRELResponse = {
  outputs: {
    ac_annual: 9180,
    solrad_annual: 4.5,
    capacity_factor: 13.9,
  },
};

describe('SolarCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch;
    // Default: successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockNRELResponse),
    } as Response);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  /**
   * Helper to create standard test input
   */
  function createTestInput(overrides?: Partial<SolarCalculationInput>): SolarCalculationInput {
    return {
      location: {
        address: '123 Test St, New York, NY',
        latitude: 40.7128,
        longitude: -74.006,
        state: 'NY',
      },
      monthlyBill: 120,
      roofArea: 1000,
      utilityRate: 0.15,
      state: 'NY',
      ...overrides,
    };
  }

  describe('calculate() - main entry point', () => {
    it('should return complete calculation results', async () => {
      const input = createTestInput();
      const result = await SolarCalculator.calculate(input);

      // Verify all required fields exist
      expect(result).toHaveProperty('systemSize');
      expect(result).toHaveProperty('systemCost');
      expect(result).toHaveProperty('annualProduction');
      expect(result).toHaveProperty('annualSavings');
      expect(result).toHaveProperty('paybackPeriod');
      expect(result).toHaveProperty('twentyYearSavings');
      expect(result).toHaveProperty('co2Offset');
      expect(result).toHaveProperty('roiPercent');
      expect(result).toHaveProperty('incentives');
    });

    it('should calculate reasonable system size based on bill', async () => {
      const result = await SolarCalculator.calculate(createTestInput({ monthlyBill: 120 }));

      // $120 bill at $0.15/kWh = 800 kWh/month = ~7-10 kW system typically
      expect(result.systemSize).toBeGreaterThan(0);
      expect(result.systemSize).toBeLessThan(20);
    });

    it('should scale system size with higher bills', async () => {
      const lowBillResult = await SolarCalculator.calculate(createTestInput({ monthlyBill: 100 }));
      const highBillResult = await SolarCalculator.calculate(createTestInput({ monthlyBill: 300 }));

      expect(highBillResult.systemSize).toBeGreaterThan(lowBillResult.systemSize);
    });
  });

  describe('NREL PVWatts API integration', () => {
    it('should use NREL API data when available', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      // Should have called fetch for NREL API
      expect(mockFetch).toHaveBeenCalled();
      // Production should match mock response
      expect(result.annualProduction).toBe(mockNRELResponse.outputs.ac_annual);
    });

    it('should fallback to manual calculation when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await SolarCalculator.calculate(createTestInput());

      // Should still return valid results using fallback calculation
      expect(result.annualProduction).toBeGreaterThan(0);
      // Production should NOT match mock response since API failed
      expect(result.annualProduction).not.toBe(mockNRELResponse.outputs.ac_annual);
    });

    it('should fallback when network error occurs', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await SolarCalculator.calculate(createTestInput());

      // Should still return valid results
      expect(result.annualProduction).toBeGreaterThan(0);
    });

    it('should handle missing API key gracefully', async () => {
      const originalKey = process.env.PVWATTS_API_KEY;
      delete process.env.PVWATTS_API_KEY;

      const result = await SolarCalculator.calculate(createTestInput());

      // Should fallback to manual calculation
      expect(result.annualProduction).toBeGreaterThan(0);

      // Restore
      process.env.PVWATTS_API_KEY = originalKey;
    });
  });

  describe('financial calculations', () => {
    it('should calculate system cost proportional to size', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      expect(result.systemCost).toBeGreaterThan(0);
      // Cost should be in reasonable range ($2-4 per watt typical)
      const costPerWatt = result.systemCost / (result.systemSize * 1000);
      expect(costPerWatt).toBeGreaterThan(1.5);
      expect(costPerWatt).toBeLessThan(5);
    });

    it('should calculate federal incentive at 30% ITC rate', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      // Federal ITC is 30% through 2025
      const expectedFederal = result.systemCost * 0.30;
      expect(result.incentives.federal).toBeCloseTo(expectedFederal, 0);
    });

    it('should calculate positive annual savings', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      expect(result.annualSavings).toBeGreaterThan(0);
      // Savings = production * utility rate
      const expectedSavings = result.annualProduction * 0.15;
      expect(result.annualSavings).toBeCloseTo(expectedSavings, 0);
    });

    it('should calculate reasonable payback period', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      // Payback should be positive and less than 30 years
      expect(result.paybackPeriod).toBeGreaterThan(0);
      expect(result.paybackPeriod).toBeLessThan(30);
    });

    it('should calculate 20-year savings greater than first year', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      expect(result.twentyYearSavings).toBeGreaterThan(result.annualSavings);
      // Should be roughly 15-25x annual (accounting for degradation and escalation)
      expect(result.twentyYearSavings).toBeLessThan(result.annualSavings * 30);
    });

    it('should calculate positive ROI', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      // Solar typically has positive ROI over 20 years
      expect(result.roiPercent).toBeGreaterThan(0);
    });

    it('should calculate CO2 offset', async () => {
      const result = await SolarCalculator.calculate(createTestInput());

      expect(result.co2Offset).toBeGreaterThan(0);
    });
  });

  describe('SREC calculations', () => {
    it('should include SREC data for eligible states', async () => {
      const input = createTestInput({ state: 'NJ' }); // NJ has strong SREC program
      const result = await SolarCalculator.calculate(input);

      // NJ should have SREC data
      expect(result.srecData).toBeDefined();
      if (result.srecData) {
        expect(result.srecData.isEligible).toBe(true);
        expect(result.srecData.annualIncome).toBeGreaterThan(0);
      }
    });

    it('should include totalAnnualSavings with SREC', async () => {
      const input = createTestInput({ state: 'NJ' });
      const result = await SolarCalculator.calculate(input);

      if (result.srecData?.isEligible) {
        // Total should include both electricity savings and SREC
        expect(result.totalAnnualSavings).toBeGreaterThan(result.annualSavings);
      }
    });
  });

  describe('geographic variations', () => {
    it('should produce different results for different latitudes', async () => {
      // Southern location (more sun)
      const southernInput = createTestInput({
        location: { ...createTestInput().location, latitude: 33.4484, longitude: -112.074 }, // Phoenix
      });

      // Northern location (less sun)
      const northernInput = createTestInput({
        location: { ...createTestInput().location, latitude: 47.6062, longitude: -122.3321 }, // Seattle
      });

      // Mock different NREL responses for different locations
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ outputs: { ac_annual: 11000, solrad_annual: 6.0, capacity_factor: 18 } }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ outputs: { ac_annual: 7000, solrad_annual: 3.5, capacity_factor: 12 } }),
        } as Response);

      const southernResult = await SolarCalculator.calculate(southernInput);
      const northernResult = await SolarCalculator.calculate(northernInput);

      // Southern location should have higher production
      expect(southernResult.annualProduction).toBeGreaterThan(northernResult.annualProduction);
    });
  });

  describe('edge cases', () => {
    it('should handle very low monthly bill', async () => {
      const result = await SolarCalculator.calculate(createTestInput({ monthlyBill: 20 }));

      expect(result.systemSize).toBeGreaterThan(0);
      expect(result.systemSize).toBeLessThan(5); // Small system for low usage
    });

    it('should handle very high monthly bill', async () => {
      const result = await SolarCalculator.calculate(createTestInput({ monthlyBill: 500 }));

      expect(result.systemSize).toBeGreaterThan(5); // Larger system for high usage
    });

    it('should handle zero roof area gracefully', async () => {
      // This tests that the calculator doesn't crash
      const result = await SolarCalculator.calculate(createTestInput({ roofArea: 0 }));

      expect(result).toBeDefined();
      expect(result.systemSize).toBeGreaterThanOrEqual(0);
    });
  });
});
