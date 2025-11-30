# PRP-[NUMBER]: [Feature Name]

**Status:** Draft | In Progress | Complete | Blocked
**Created:** YYYY-MM-DD
**Updated:** YYYY-MM-DD
**Author:** [Your Name]

---

## Overview

[2-3 sentence description of what this feature does and why it's valuable]

---

## User Story

**As a** [user type]
**I want** [goal]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] User can [action 1]
- [ ] System displays [result 1]
- [ ] Edge case [scenario] is handled gracefully

---

## Technical Approach

### 1. Component Design (React + Next.js 15)

**Primary Component:**
- **Path:** `src/components/calculator/FeatureName.tsx`
- **Type:** Client Component (`'use client'`)
- **Pattern:** [CalculatorLanding | AddressInput | SRECIncome | Custom]
- **State Management:** React useState/useEffect

**Props Interface:**
```typescript
interface FeatureNameProps {
  initialValue?: number;
  onCalculate?: (result: FeatureOutput) => void;
  className?: string;
}
```

**Component Structure:**
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { featureFunction } from '@/lib/feature-name';
import type { FeatureInput, FeatureOutput } from '@/types';

export function FeatureName({ initialValue = 0, onCalculate }: FeatureNameProps) {
  const [result, setResult] = useState<FeatureOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const output = await featureFunction({ value: initialValue });
      setResult(output);
      onCalculate?.(output);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Feature Name</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form inputs */}
        <Button onClick={handleCalculate} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>
        {result && (
          <div className="mt-4">
            {/* Display results */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 2. Business Logic (Core Calculations)

**File:** `src/lib/feature-name.ts`

**Exported Functions:**
```typescript
export function featureFunction(input: FeatureInput): FeatureOutput;
export function helperFunction(param: string): number;
```

**Implementation Pattern:**
```typescript
import type { FeatureInput, FeatureOutput } from '@/types';

/**
 * Calculates [feature description].
 *
 * @param input - Input parameters
 * @returns Calculated output
 * @throws {Error} If input validation fails
 *
 * @example
 * ```typescript
 * const result = featureFunction({ value: 100 });
 * ```
 */
export function featureFunction(input: FeatureInput): FeatureOutput {
  // 1. Validate input
  if (!input || typeof input.value !== 'number') {
    throw new Error('Invalid input: value must be a number');
  }

  // 2. Handle edge cases
  const safeValue = Math.max(0, input.value);

  // 3. Core calculation logic
  const result = calculateCore(safeValue);

  // 4. Return typed output
  return {
    result,
    metadata: {
      calculatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

function calculateCore(value: number): number {
  // Implementation
  return value * 1.5;
}
```

---

### 3. API Integration (Choose One or None)

#### Option A: NREL PVWatts API Integration

**Use Case:** Solar production calculations

```typescript
import { SolarCalculator } from '@/lib/calculations';

const calculator = new SolarCalculator();

try {
  const solarData = await calculator.calculateSolarProduction({
    address: "123 Main St, Boston, MA 02101",
    systemSize: 7.5,
    electricityRate: 0.23
  });

  // Use solarData.annualProduction, solarData.monthlyProduction, etc.
} catch (error) {
  // Fallback to manual calculation
  const fallbackProduction = systemSize * 1300; // kWh/kW/year average
}
```

**Required Environment Variable:**
```bash
PVWATTS_API_KEY=your-nrel-api-key
```

---

#### Option B: Google Solar API Integration

**Use Case:** Roof analysis, shading, optimal panel placement

```typescript
import { getSolarPotential } from '@/lib/solar-api';

try {
  const roofData = await getSolarPotential({
    latitude: 42.3601,
    longitude: -71.0589,
    address: "123 Main St, Boston, MA"
  });

  // Use roofData.maxArrayPanelsCount, roofData.solarPanels, etc.
} catch (error) {
  // Fallback to NREL or manual estimation
}
```

**Required Environment Variables:**
```bash
GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

---

#### Option C: Custom API Route

**Use Case:** Server-side processing, database operations

**File:** `src/app/api/feature/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { featureFunction } from '@/lib/feature-name';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process request
    const result = featureFunction(body);

    // Optional: Store in database
    const supabase = createClient();
    await supabase.from('feature_data').insert({
      tenant_id: 'calculator',
      result_data: result
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Calculation failed' },
      { status: 500 }
    );
  }
}
```

---

### 4. Database Schema (if Supabase storage needed)

**Table:** `feature_data`

```sql
-- Create table
CREATE TABLE feature_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'calculator',
  session_id TEXT,
  input_value DECIMAL NOT NULL,
  result_value DECIMAL NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feature_data ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY "tenant_isolation_select" ON feature_data
  FOR SELECT USING (tenant_id = 'calculator');

CREATE POLICY "tenant_isolation_insert" ON feature_data
  FOR INSERT WITH CHECK (tenant_id = 'calculator');

-- Indexes
CREATE INDEX idx_feature_data_tenant ON feature_data(tenant_id);
CREATE INDEX idx_feature_data_created ON feature_data(created_at DESC);
```

**Supabase Client Usage:**
```typescript
import { createClient } from '@/lib/supabase/client'; // Browser
// OR
import { createClient } from '@/lib/supabase/server'; // API routes

const supabase = createClient();

// Insert
const { data, error } = await supabase
  .from('feature_data')
  .insert({
    tenant_id: 'calculator',
    input_value: 100,
    result_value: 150
  });

// Query
const { data, error } = await supabase
  .from('feature_data')
  .select('*')
  .eq('tenant_id', 'calculator')
  .order('created_at', { ascending: false })
  .limit(10);
```

---

### 5. Type Definitions

**File:** `src/types/index.ts`

```typescript
export interface FeatureInput {
  value: number;
  options?: {
    precision?: number;
    roundUp?: boolean;
  };
}

export interface FeatureOutput {
  result: number;
  metadata: {
    calculatedAt: string;
    version: string;
  };
}

export interface FeatureDataRecord {
  id: string;
  tenant_id: string;
  input_value: number;
  result_value: number;
  created_at: string;
}
```

---

### 6. Testing Strategy (Vitest + React Testing Library)

#### Unit Tests: `src/lib/feature-name.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { featureFunction } from './feature-name';

describe('featureFunction', () => {
  describe('happy path', () => {
    it('should calculate correctly with valid input', () => {
      const result = featureFunction({ value: 100 });
      expect(result.result).toBe(150);
    });
  });

  describe('edge cases', () => {
    it('should handle zero value', () => {
      const result = featureFunction({ value: 0 });
      expect(result.result).toBe(0);
    });

    it('should handle negative values', () => {
      const result = featureFunction({ value: -50 });
      expect(result.result).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large values', () => {
      const result = featureFunction({ value: 1_000_000 });
      expect(result.result).toBeLessThan(Infinity);
    });
  });

  describe('error handling', () => {
    it('should throw on invalid input', () => {
      expect(() => featureFunction({} as any)).toThrow('Invalid input');
    });

    it('should throw on null input', () => {
      expect(() => featureFunction(null as any)).toThrow('Invalid input');
    });
  });

  describe('options', () => {
    it('should respect precision option', () => {
      const result = featureFunction({
        value: 100.12345,
        options: { precision: 2 }
      });
      expect(result.result).toBe(150.19); // Rounded to 2 decimals
    });
  });
});
```

#### Component Tests: `src/components/calculator/FeatureName.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatureName } from './FeatureName';

describe('FeatureName Component', () => {
  it('should render correctly', () => {
    render(<FeatureName />);
    expect(screen.getByText('Feature Name')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
  });

  it('should calculate on button click', async () => {
    render(<FeatureName initialValue={100} />);

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      expect(screen.getByText(/150/)).toBeInTheDocument();
    });
  });

  it('should call onCalculate callback', async () => {
    const onCalculate = vi.fn();
    render(<FeatureName initialValue={100} onCalculate={onCalculate} />);

    fireEvent.click(screen.getByText('Calculate'));

    await waitFor(() => {
      expect(onCalculate).toHaveBeenCalledWith(
        expect.objectContaining({ result: 150 })
      );
    });
  });

  it('should show loading state', async () => {
    render(<FeatureName />);

    fireEvent.click(screen.getByText('Calculate'));

    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });
});
```

**Expected Test Count:** [X unit tests] + [Y component tests] = [Z total tests]

---

## Implementation Steps

### Phase 1: Setup (5 min)
1. Create test file: `src/lib/feature-name.test.ts`
2. Create implementation file: `src/lib/feature-name.ts`
3. Add type definitions to `src/types/index.ts`
4. Update `package.json` dependencies if needed

### Phase 2: Test-Driven Development (30 min)
1. Write failing unit tests
2. Implement minimal code to pass tests
3. Refactor for clarity and performance
4. Add component tests
5. Implement component
6. Verify all tests pass

### Phase 3: Integration (20 min)
1. Connect to NREL/Google API if needed
2. Add Supabase storage if needed
3. Create API route if needed
4. Wire up UI components
5. Test in development environment

### Phase 4: Validation (10 min)
1. Run `npm run type-check` (0 errors expected)
2. Run `npm test` (all tests passing)
3. Run `npm run build` (build succeeds)
4. Manual testing in browser

### Phase 5: Documentation (10 min)
1. Update `CLAUDE.md` with feature details
2. Update `TASK.md` with completion status
3. Add JSDoc comments to all exported functions
4. Update README if user-facing changes

---

## Acceptance Criteria

- [ ] All unit tests passing ([X] tests)
- [ ] All component tests passing ([Y] tests)
- [ ] TypeScript errors = 0
- [ ] Build successful
- [ ] Feature works in dev environment
- [ ] Manual testing completed
- [ ] Edge cases handled
- [ ] Error handling comprehensive
- [ ] Documentation updated
- [ ] Critical Rules followed

---

## Dependencies

**Required:**
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Optional (based on feature):**
- [ ] NREL PVWatts API (`PVWATTS_API_KEY`)
- [ ] Google Solar API (`GOOGLE_API_KEY`)
- [ ] Google Maps API (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`)
- [ ] Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] New npm package: [package-name]

---

## Critical Rules Compliance

**MUST FOLLOW:**
- [ ] **NO OpenAI** - This feature does NOT use OpenAI models or APIs
- [ ] **API Keys in .env ONLY** - No hardcoded secrets anywhere
- [ ] **Tenant Isolation** - All Supabase queries include `tenant_id = 'calculator'`
- [ ] **Test-Driven** - Tests written BEFORE implementation
- [ ] **Type Safety** - All functions fully typed, no `any` types

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|------------------|
| Invalid input | Throw clear error message |
| Null/undefined | Throw validation error |
| API failure | Fallback to manual calculation |
| Network timeout | Show user-friendly error |
| Zero value | Handle gracefully |
| Negative value | Clamp to zero or reject |
| Very large value | Cap at reasonable maximum |

---

## Performance Considerations

- [ ] API calls cached/memoized if appropriate
- [ ] Component memoized with `React.memo` if heavy
- [ ] Expensive calculations moved to Web Workers if >100ms
- [ ] Bundle size impact < 5KB
- [ ] No unnecessary re-renders

---

## Rollback Plan

If feature fails in production:

1. **Immediate:** Revert deployment in Vercel
2. **Investigate:** Check Vercel logs for errors
3. **Fix:** Address issues in development
4. **Re-validate:** Run full test suite
5. **Re-deploy:** Only after all validations pass

---

## Success Metrics

**Feature is successful if:**
1. All tests passing (23+ total)
2. Zero TypeScript errors
3. Build succeeds
4. Users can complete task in < 30 seconds
5. No errors in production logs (first 24 hours)
6. Positive user feedback

---

## Notes & Learnings

[Add any insights, challenges, or learnings during implementation]

---

## Related PRPs

- PRP-XXX: [Related feature]
- PRP-YYY: [Dependency]

---

## Sign-off

**Implemented by:** [Name]
**Date Completed:** YYYY-MM-DD
**Tests Added:** [X] tests
**Total Tests:** [23+] tests passing
**Status:** ✅ Complete | ❌ Blocked | 🚧 In Progress
