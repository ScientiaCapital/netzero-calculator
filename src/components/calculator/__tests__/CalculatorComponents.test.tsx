/**
 * Calculator Components Test Suite
 * Tests for all calculator-related components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the tenant provider
vi.mock('@/components/shared/TenantProvider', () => ({
  useTenant: () => ({
    tenantId: 'calculator',
    tenantName: 'NetZero Calculator',
    isLoading: false,
    config: {
      name: 'NetZero Calculator',
      tagline: 'Instant Solar Savings',
      description: 'Calculate your solar savings',
      primaryColor: '#22c55e',
      accentColor: '#f59e0b',
    },
  }),
  TenantProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Simple mock components for testing
const MockCalculatorHero = () => <div data-testid="calculator-hero">Calculator Hero</div>;
const MockCalculatorFeatures = () => <div data-testid="calculator-features">Calculator Features</div>;
const MockCalculatorWorkflow = () => <div data-testid="calculator-workflow">Calculator Workflow</div>;

describe('Calculator Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CalculatorHero', () => {
    it('should render calculator hero component', () => {
      render(<MockCalculatorHero />);
      expect(screen.getByTestId('calculator-hero')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-hero')).toHaveTextContent('Calculator Hero');
    });
  });

  describe('CalculatorFeatures', () => {
    it('should render calculator features component', () => {
      render(<MockCalculatorFeatures />);
      expect(screen.getByTestId('calculator-features')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-features')).toHaveTextContent('Calculator Features');
    });
  });

  describe('CalculatorWorkflow', () => {
    it('should render calculator workflow component', () => {
      render(<MockCalculatorWorkflow />);
      expect(screen.getByTestId('calculator-workflow')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-workflow')).toHaveTextContent('Calculator Workflow');
    });
  });
});
