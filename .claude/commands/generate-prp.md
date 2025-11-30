# Generate PRP - Project Requirements Plan Generator

Generate comprehensive PRPs for NetZero Calculator features with proper context, design patterns, and implementation steps.

---

## Critical Rules (Read First)

1. **NO OpenAI** - Use NREL PVWatts, Google Solar API, or Anthropic Claude only
2. **API Keys in .env ONLY** - Never hardcode secrets
3. **Tenant Isolation** - All database operations respect `tenant_id = 'calculator'`
4. **Test-Driven** - Write tests before implementation

---

## PRP Generation Process

### Step 1: Load Project Context

Read these files to understand the codebase:

```bash
# Core documentation
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/CLAUDE.md

# Architecture patterns
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/.claude/PROJECT_CONTEXT.md

# Solar calculation engine
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/src/lib/calculations.ts

# SREC income calculator
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/src/lib/srec-calculator.ts

# State-specific pricing
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/src/lib/state-pricing.ts

# Supabase integration
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/src/lib/supabase/index.ts

# Type definitions
cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/src/types/index.ts
```

---

### Step 2: Identify Design Patterns

**Component Patterns:**
- `CalculatorLanding.tsx` - Main landing page with hero + form
- `AddressInput.tsx` - Google Maps autocomplete integration
- `EnhancedCalculatorForm.tsx` - Multi-step form with validation
- `LeadCaptureForm.tsx` - Modal with lead capture
- `SRECIncome.tsx` - Data visualization with charts

**API Integration Patterns:**
- NREL PVWatts API (`calculations.ts`)
- Google Solar API (`solar-api.ts`)
- Supabase client (`lib/supabase/client.ts` for browser, `server.ts` for API routes)

**Business Logic Patterns:**
- Solar calculations: `SolarCalculator` class
- SREC income: `calculateSRECIncome()` function
- State pricing: `getStatePricing()` lookup
- Financial projections: ROI, payback period, lifetime savings

**Testing Patterns (Vitest + React Testing Library):**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('FeatureName', () => {
  it('should calculate correctly', () => {
    // Arrange
    const input = { ... };

    // Act
    const result = calculateFeature(input);

    // Assert
    expect(result).toEqual(expected);
  });
});
```

---

### Step 3: Analyze Feature Request

**Questions to Answer:**

1. **What user problem does this solve?**
   - Is it a new calculation?
   - Is it a UI/UX enhancement?
   - Is it a data integration?

2. **What existing patterns apply?**
   - Can we reuse `SolarCalculator`?
   - Does it need NREL API integration?
   - Does it require Supabase storage?

3. **What are the acceptance criteria?**
   - What inputs are required?
   - What outputs are expected?
   - What edge cases must be handled?

4. **What tests are needed?**
   - Unit tests for calculations
   - Component tests for UI
   - Integration tests for API calls

---

### Step 4: Write PRP Document

Use the template at `/Users/tmkipper/Desktop/tk_projects/netzero-calculator/PRPs/templates/prp_base.md`

**PRP Structure:**

```markdown
# PRP-[NUMBER]: [Feature Name]

## Overview
[2-3 sentence description]

## User Story
As a [user type], I want [goal] so that [benefit].

## Technical Approach

### 1. Component Design
- Component: `src/components/calculator/NewFeature.tsx`
- Pattern: [CalculatorLanding / AddressInput / SRECIncome]
- Props: [list required props with types]

### 2. Business Logic
- File: `src/lib/feature-calculator.ts`
- Functions: [list exported functions]
- Dependencies: [NREL API / Google Solar / Supabase]

### 3. API Integration (if needed)
- Endpoint: `src/app/api/feature/route.ts`
- Method: POST
- Request: [TypeScript interface]
- Response: [TypeScript interface]

### 4. Database Schema (if needed)
```sql
-- Supabase table
CREATE TABLE feature_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'calculator',
  ...
);
```

### 5. Tests
- Unit tests: `src/lib/feature-calculator.test.ts`
- Component tests: `src/components/calculator/NewFeature.test.tsx`
- Expected coverage: [X tests]

## Implementation Steps

1. **Setup**
   - Create test file
   - Create implementation file
   - Update types

2. **Test-Driven Development**
   - Write failing test
   - Implement minimal code to pass
   - Refactor

3. **Integration**
   - Connect to NREL API (if needed)
   - Add Supabase storage (if needed)
   - Wire up UI components

4. **Validation**
   - Run type check
   - Run tests
   - Run build
   - Manual testing

## Acceptance Criteria
- [ ] All tests passing
- [ ] TypeScript errors = 0
- [ ] Build successful
- [ ] Feature works in dev environment
- [ ] Documentation updated

## Dependencies
- NREL PVWatts API (if using solar calculations)
- Google Maps API (if using address input)
- Supabase (if storing data)

## Critical Rules Compliance
- [ ] NO OpenAI usage
- [ ] API keys in .env only
- [ ] Tenant isolation enforced
- [ ] Tests written before implementation
```

---

### Step 5: Include Code Examples

**NREL PVWatts Integration Example:**
```typescript
import { SolarCalculator } from '@/lib/calculations';

const calculator = new SolarCalculator();
const results = await calculator.calculateSolarProduction({
  address: "123 Main St, Boston, MA",
  systemSize: 7.5,
  electricityRate: 0.23
});
```

**SREC Income Calculation Example:**
```typescript
import { calculateSRECIncome } from '@/lib/srec-calculator';
import { SREC_STATES } from '@/lib/srec-states';

if (SREC_STATES[state]) {
  const srecIncome = calculateSRECIncome({
    state,
    systemSize: 7.5,
    annualProduction: 9500
  });
}
```

**Supabase Lead Capture Example:**
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = createClient();
const { data, error } = await supabase
  .from('lead_submissions')
  .insert({
    tenant_id: 'calculator',
    name,
    email,
    phone,
    system_size_kw: systemSize,
    annual_savings: annualSavings
  });
```

**Component Pattern Example:**
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function NewFeature() {
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = async () => {
    // Implementation
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Feature Name</h2>
      {/* UI components */}
      <Button onClick={handleCalculate}>Calculate</Button>
    </Card>
  );
}
```

---

## State-Specific Pricing Reference

The calculator supports all 50 US states with accurate pricing:

**High Solar Adoption States:**
- California: $0.30/kWh
- Massachusetts: $0.23/kWh
- New Jersey: $0.16/kWh
- Connecticut: $0.22/kWh
- New York: $0.19/kWh

**SREC-Eligible States (15 total):**
1. New Jersey ($225/SREC)
2. Massachusetts ($285/SREC)
3. District of Columbia ($390/SREC)
4. Maryland ($75/SREC)
5. Pennsylvania ($42/SREC)
6. Ohio ($10/SREC)
7. Illinois ($78/SREC)
8. Delaware ($25/SREC)
9. North Carolina ($135/SREC)
10. Connecticut ($45/SREC)
11. New Hampshire ($55/SREC)
12. Rhode Island ($85/SREC)
13. West Virginia ($90/SREC)
14. Michigan ($30/SREC)
15. Indiana ($20/SREC)

---

## Output Format

Save PRP to: `/Users/tmkipper/Desktop/tk_projects/netzero-calculator/PRPs/prp-[number]-[feature-slug].md`

Example: `PRPs/prp-001-battery-storage-calculator.md`

---

## Usage

```bash
# Generate PRP for new feature
/generate-prp [feature description]

# Example
/generate-prp Add battery storage cost calculator
```

---

## Next Steps After PRP Generation

1. Review PRP with team
2. Get approval on technical approach
3. Execute PRP using `/execute-prp` command
4. Track progress in `TASK.md`
