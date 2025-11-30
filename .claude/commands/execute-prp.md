# Execute PRP - 6-Phase Execution Workflow

Execute Project Requirements Plans with structured phases, validation gates, and quality checks.

---

## Critical Rules (Read First)

1. **NO OpenAI** - Use NREL PVWatts, Google Solar API, or Anthropic Claude only
2. **Test-Driven Development** - Write tests BEFORE implementation
3. **Validation Gates** - Each phase must pass before proceeding
4. **API Keys in .env ONLY** - Never hardcode secrets
5. **Tenant Isolation** - All database operations respect `tenant_id = 'calculator'`

---

## 6-Phase Execution Workflow

### Phase 1: Context Loading (5 min)

**Goal:** Understand the feature requirements and existing codebase patterns.

**Actions:**

1. **Load PRP Document**
   ```bash
   cat /Users/tmkipper/Desktop/tk_projects/netzero-calculator/PRPs/prp-[number]-[feature-slug].md
   ```

2. **Load Relevant Code**
   - Read `CLAUDE.md` for project overview
   - Read `src/lib/calculations.ts` for calculator patterns
   - Read `src/lib/srec-calculator.ts` for SREC patterns
   - Read `src/types/index.ts` for type definitions

3. **Identify Dependencies**
   - NREL PVWatts API required? Check `.env.local` for `PVWATTS_API_KEY`
   - Google Solar API required? Check `.env.local` for `GOOGLE_API_KEY`
   - Supabase storage required? Check database schema
   - New npm packages needed? Update `package.json`

**Validation Gate:**
- [ ] PRP requirements understood
- [ ] Existing patterns identified
- [ ] Dependencies available
- [ ] No blockers

---

### Phase 2: ULTRATHINK Planning (10 min)

**Goal:** Deep thinking about implementation approach, edge cases, and potential issues.

**ULTRATHINK Framework:**

```
## Implementation Plan

### What are we building?
[Clear 2-3 sentence description]

### Why this approach?
[Reasoning for chosen pattern/architecture]

### What could go wrong?
1. Edge case: [scenario]
   - Mitigation: [strategy]
2. API failure: [scenario]
   - Fallback: [strategy]
3. Type safety: [scenario]
   - Solution: [strategy]

### How will we test?
1. Unit tests: [specific scenarios]
2. Component tests: [user interactions]
3. Integration tests: [API calls]

### What are the acceptance criteria?
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

**Validation Gate:**
- [ ] Implementation approach clear
- [ ] Edge cases identified
- [ ] Test strategy defined
- [ ] Success criteria documented

---

### Phase 3: Implementation (30-60 min)

**Goal:** Write code following TDD principles and project patterns.

#### Step 3.1: Setup Test File FIRST

```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator

# Create test file
touch src/lib/feature-name.test.ts

# Create implementation file
touch src/lib/feature-name.ts
```

**Test Template:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { featureFunction } from './feature-name';

describe('featureFunction', () => {
  it('should calculate correctly with valid input', () => {
    // Arrange
    const input = { /* test data */ };

    // Act
    const result = featureFunction(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('should handle edge case: empty input', () => {
    expect(() => featureFunction({})).toThrow('Invalid input');
  });

  it('should handle edge case: negative values', () => {
    const result = featureFunction({ value: -10 });
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
```

#### Step 3.2: Watch Tests Fail (RED)

```bash
npm test src/lib/feature-name.test.ts
```

**Expected:** All tests fail (no implementation yet)

#### Step 3.3: Write Minimal Implementation (GREEN)

```typescript
// src/lib/feature-name.ts
export interface FeatureInput {
  value: number;
  // ... other fields
}

export interface FeatureOutput {
  result: number;
  // ... other fields
}

export function featureFunction(input: FeatureInput): FeatureOutput {
  // Validate input
  if (!input || typeof input.value !== 'number') {
    throw new Error('Invalid input');
  }

  // Handle edge cases
  const safeValue = Math.max(0, input.value);

  // Core calculation
  const result = safeValue * 1.5; // Example logic

  return { result };
}
```

#### Step 3.4: Make Tests Pass (GREEN)

```bash
npm test src/lib/feature-name.test.ts
```

**Expected:** All tests pass

#### Step 3.5: Refactor (REFACTOR)

- Extract constants
- Add comments
- Improve variable names
- Optimize performance

#### Step 3.6: Add Component (if UI feature)

```typescript
// src/components/calculator/FeatureName.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { featureFunction } from '@/lib/feature-name';

export function FeatureName() {
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const output = featureFunction({ value: 100 });
    setResult(output.result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Name</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleCalculate}>Calculate</Button>
        {result !== null && (
          <p className="mt-4">Result: {result}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Step 3.7: Add Component Tests

```typescript
// src/components/calculator/FeatureName.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureName } from './FeatureName';

describe('FeatureName Component', () => {
  it('should render button', () => {
    render(<FeatureName />);
    expect(screen.getByText('Calculate')).toBeInTheDocument();
  });

  it('should display result after calculation', () => {
    render(<FeatureName />);
    fireEvent.click(screen.getByText('Calculate'));
    expect(screen.getByText(/Result:/)).toBeInTheDocument();
  });
});
```

**Validation Gate:**
- [ ] Tests written before implementation
- [ ] All tests passing
- [ ] Component renders correctly
- [ ] Edge cases handled

---

### Phase 4: Validation (10 min)

**Goal:** Ensure code quality, type safety, and build success.

#### Step 4.1: Type Check

```bash
npm run type-check
```

**Expected:** 0 TypeScript errors

#### Step 4.2: Run All Tests

```bash
npm test
```

**Expected:** All tests passing (23+ tests depending on new features)

#### Step 4.3: Build

```bash
npm run build
```

**Expected:** Build succeeds, check bundle size

#### Step 4.4: Manual Testing

```bash
npm run dev
```

**Test in browser:**
1. Navigate to feature
2. Test happy path
3. Test edge cases
4. Test error handling

**Validation Gate:**
- [ ] Type check passed
- [ ] All tests passed
- [ ] Build succeeded
- [ ] Manual testing completed

---

### Phase 5: Review (10 min)

**Goal:** Self-review code quality, patterns, and critical rules compliance.

**Code Review Checklist:**

**Critical Rules:**
- [ ] NO OpenAI usage anywhere
- [ ] API keys in .env only (check for hardcoded values)
- [ ] Tenant isolation enforced (all Supabase queries include `tenant_id`)
- [ ] Tests written before implementation

**Code Quality:**
- [ ] Variable names clear and descriptive
- [ ] Functions single-responsibility
- [ ] Comments explain "why" not "what"
- [ ] No magic numbers (use constants)
- [ ] Error handling comprehensive

**Type Safety:**
- [ ] All function parameters typed
- [ ] All function return types explicit
- [ ] No `any` types used
- [ ] Interfaces exported from `types/index.ts`

**Testing:**
- [ ] Unit tests cover edge cases
- [ ] Component tests cover user interactions
- [ ] Integration tests cover API calls
- [ ] Test descriptions clear

**Performance:**
- [ ] No unnecessary re-renders
- [ ] API calls cached/memoized if appropriate
- [ ] Bundle size impact minimal

**Validation Gate:**
- [ ] All checklist items checked
- [ ] No critical issues found
- [ ] Code ready for commit

---

### Phase 6: Documentation (5 min)

**Goal:** Update project documentation to reflect new feature.

#### Step 6.1: Update CLAUDE.md

Add feature to relevant section:

```markdown
### New Feature Name
- **Component:** `src/components/calculator/FeatureName.tsx`
- **Logic:** `src/lib/feature-name.ts`
- **Tests:** 5 tests passing
- **Description:** [what it does]
```

#### Step 6.2: Update TASK.md

```markdown
## Completed (2025-11-30)
- [x] Feature Name implementation
  - Tests: 5 new tests (28 total)
  - Files: feature-name.ts, FeatureName.tsx
  - Impact: [user benefit]
```

#### Step 6.3: Update Type Definitions (if new types)

```typescript
// src/types/index.ts
export interface FeatureInput {
  value: number;
}

export interface FeatureOutput {
  result: number;
}
```

#### Step 6.4: Add JSDoc Comments

```typescript
/**
 * Calculates feature result based on input value.
 *
 * @param input - Feature input with value
 * @returns Feature output with calculated result
 * @throws {Error} If input is invalid
 *
 * @example
 * ```typescript
 * const result = featureFunction({ value: 100 });
 * console.log(result.result); // 150
 * ```
 */
export function featureFunction(input: FeatureInput): FeatureOutput {
  // ...
}
```

**Validation Gate:**
- [ ] CLAUDE.md updated
- [ ] TASK.md updated
- [ ] Type definitions exported
- [ ] JSDoc comments added

---

## Final Validation

Before marking PRP as complete:

```bash
# Run full validation suite
npm run type-check && npm test && npm run build
```

**All must pass:**
- ✅ Type check: 0 errors
- ✅ Tests: All passing
- ✅ Build: Success

---

## Completion Checklist

```
PRP-[NUMBER]: [Feature Name]
===============================
Phase 1: Context Loading        [✅/❌]
Phase 2: ULTRATHINK Planning    [✅/❌]
Phase 3: Implementation         [✅/❌]
Phase 4: Validation             [✅/❌]
Phase 5: Review                 [✅/❌]
Phase 6: Documentation          [✅/❌]

Critical Rules Compliance:
- NO OpenAI usage               [✅/❌]
- API keys in .env only         [✅/❌]
- Tenant isolation enforced     [✅/❌]
- Test-driven development       [✅/❌]

Tests Added:                    [X tests]
Tests Passing:                  [23+ total]
TypeScript Errors:              [0]
Build Status:                   [✅/❌]

PRP Status:                     [COMPLETE/BLOCKED]
```

---

## Emergency Rollback

If any phase fails critically:

```bash
# Discard changes
git checkout -- .

# Or stash changes
git stash save "WIP: PRP-[NUMBER] - failed at phase [X]"

# Document blocker in PRP
echo "## Blocker: [description]" >> PRPs/prp-[number]-[feature-slug].md
```

---

## Usage

```bash
# Execute PRP by number
/execute-prp prp-001-battery-storage-calculator

# Or provide PRP path
/execute-prp PRPs/prp-001-battery-storage-calculator.md
```

---

## Success Metrics

A successful PRP execution means:
1. All 6 phases completed
2. All tests passing (23+ total)
3. Zero TypeScript errors
4. Build successful
5. Documentation updated
6. Critical rules followed
