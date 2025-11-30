'use client';

import * as React from 'react';

/**
 * TenantProvider stub - Calculator domain is single-tenant
 * This provides compatibility with multi-tenant components
 */

interface TenantConfig {
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  logo?: string;
}

interface TenantContextValue {
  tenantId: string;
  tenantName: string;
  isLoading: boolean;
  config: TenantConfig;
}

const defaultConfig: TenantConfig = {
  name: 'NetZero Calculator',
  tagline: 'Instant Solar Savings',
  description: 'Calculate your solar savings in seconds with SREC income projections',
  primaryColor: '#22c55e', // Green
  accentColor: '#f59e0b', // Amber
};

const TenantContext = React.createContext<TenantContextValue>({
  tenantId: 'calculator',
  tenantName: 'NetZero Calculator',
  isLoading: false,
  config: defaultConfig,
});

export function useTenant() {
  return React.useContext(TenantContext);
}

interface TenantProviderProps {
  children: React.ReactNode;
  tenantId?: string;
}

export function TenantProvider({ children, tenantId = 'calculator' }: TenantProviderProps) {
  const value: TenantContextValue = {
    tenantId,
    tenantName: 'NetZero Calculator',
    isLoading: false,
    config: defaultConfig,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export default TenantProvider;
