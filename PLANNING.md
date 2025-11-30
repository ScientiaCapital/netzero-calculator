# PLANNING.md - NetZero Calculator Architecture

**Project:** NetZero Calculator
**Domain:** netzerocalculator.com
**Status:** Production-Ready (Deployed Nov 30, 2025)
**Version:** 1.0.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Design](#architecture-design)
3. [Tech Stack](#tech-stack)
4. [Solar Calculation Engine](#solar-calculation-engine)
5. [SREC Income Calculator](#srec-income-calculator)
6. [Lead Capture System](#lead-capture-system)
7. [Database Schema](#database-schema)
8. [API Design](#api-design)
9. [Component Architecture](#component-architecture)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Architecture](#deployment-architecture)
12. [Security & Compliance](#security--compliance)

---

## Project Overview

### Mission
Provide instant, accurate solar savings calculations with SREC income projections for all 50 US states, helping homeowners make informed decisions about solar adoption.

### Key Features
1. **Real-Time Solar Calculations** - NREL PVWatts API integration
2. **SREC Income Projections** - 20-year projections for 15 eligible states
3. **State-Specific Pricing** - Accurate electricity rates for all 50 states
4. **Lead Capture** - Secure lead storage with Supabase
5. **Responsive Design** - Mobile-first with Tailwind CSS

### Target Users
- Homeowners exploring solar options
- Solar installers needing quick ROI estimates
- Real estate agents assessing property solar potential

---

## Architecture Design

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 15 App (Client Side)                 │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │ Calculator │  │ Address      │  │ SREC Income │  │   │
│  │  │ Landing    │  │ Input        │  │ Display     │  │   │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 Server (Vercel Edge)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes                              │   │
│  │  ┌──────────────┐         ┌──────────────┐          │   │
│  │  │ /api/        │         │ /api/health  │          │   │
│  │  │ calculator/  │         │              │          │   │
│  │  │ lead         │         │              │          │   │
│  │  └──────────────┘         └──────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │                  │                  │
           │                  │                  │
           ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ NREL     │      │ Google   │      │ Supabase │
    │ PVWatts  │      │ Solar    │      │ Postgres │
    │ API      │      │ API      │      │ Database │
    └──────────┘      └──────────┘      └──────────┘
```

### Design Principles

1. **API-First** - All calculations exposed via API routes for flexibility
2. **Client-Side Rendering** - Fast, interactive UI with React 18
3. **Progressive Enhancement** - Works without JavaScript for basic calculations
4. **Offline-Ready** - Fallback calculations when APIs unavailable
5. **Type-Safe** - TypeScript everywhere, zero `any` types

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.3 | React framework, App Router |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.7.2 | Type safety |
| **Tailwind CSS** | 3.4.17 | Styling |
| **shadcn/ui** | Latest | Component library |
| **Lucide React** | 0.555.0 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.1.3 | Serverless functions |
| **Supabase** | 2.49.1 | Database, auth, storage |
| **Zod** | 3.24.1 | Runtime validation |

### External APIs
| API | Purpose | Required |
|-----|---------|----------|
| **NREL PVWatts** | Solar production calculations | Yes (production) |
| **Google Solar API** | Roof analysis, shading | Optional |
| **Google Maps API** | Address autocomplete | Optional |
| **OpenEI API** | Utility rate data | Optional |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.1.8 | Testing framework |
| **Testing Library** | 16.1.0 | Component testing |
| **jsdom** | 27.2.0 | DOM simulation |

---

## Solar Calculation Engine

### Architecture

```typescript
// src/lib/calculations.ts

class SolarCalculator {
  private apiKey: string;
  private baseUrl: string = 'https://developer.nrel.gov/api/pvwatts/v8.json';

  async calculateSolarProduction(input: SolarCalculationInput): Promise<SolarResults> {
    // 1. Validate input
    // 2. Call NREL PVWatts API
    // 3. Process response
    // 4. Calculate financials
    // 5. Return results
  }
}
```

### Calculation Flow

```
User Input
    │
    ├─ Address (geocoding)
    ├─ System Size (kW)
    └─ Electricity Rate ($/kWh)
    │
    ▼
NREL PVWatts API
    │
    ├─ Solar Irradiance Data
    ├─ Weather Patterns
    └─ Shading Analysis
    │
    ▼
Financial Calculations
    │
    ├─ Annual Production (kWh)
    ├─ Annual Savings ($)
    ├─ System Cost ($)
    ├─ Payback Period (years)
    ├─ ROI (%)
    └─ 25-Year Lifetime Value ($)
    │
    ▼
SREC Income (if eligible)
    │
    ├─ State SREC Price ($/SREC)
    ├─ Annual SRECs Generated
    ├─ 20-Year Projection
    └─ Total SREC Income ($)
    │
    ▼
Results Display
```

### Key Algorithms

#### 1. System Size Optimization
```typescript
function calculateOptimalSystemSize(monthlyBill: number, electricityRate: number): number {
  // Average kWh usage per month
  const monthlyUsage = monthlyBill / electricityRate;

  // Annual usage
  const annualUsage = monthlyUsage * 12;

  // System size (assumes 1300 kWh/kW/year production)
  const systemSize = annualUsage / 1300;

  return Math.round(systemSize * 10) / 10; // Round to 1 decimal
}
```

#### 2. Payback Period
```typescript
function calculatePaybackPeriod(
  systemCost: number,
  annualSavings: number,
  srecIncome: number = 0
): number {
  const totalAnnualBenefit = annualSavings + srecIncome;
  return systemCost / totalAnnualBenefit;
}
```

#### 3. ROI Calculation
```typescript
function calculateROI(
  systemCost: number,
  lifetimeSavings: number,
  years: number = 25
): number {
  return ((lifetimeSavings - systemCost) / systemCost) * 100;
}
```

### Fallback Strategy

When NREL API unavailable:
1. Use state-average solar hours (from `state-pricing.ts`)
2. Apply degradation factor (0.5% per year)
3. Calculate with conservative estimates
4. Show disclaimer to user

---

## SREC Income Calculator

### Eligible States (15 Total)

| State | Code | SREC Price | Program Status |
|-------|------|-----------|----------------|
| District of Columbia | DC | $390 | Active |
| Massachusetts | MA | $285 | Active |
| New Jersey | NJ | $225 | Active |
| North Carolina | NC | $135 | Active |
| West Virginia | WV | $90 | Active |
| Rhode Island | RI | $85 | Active |
| Illinois | IL | $78 | Active |
| Maryland | MD | $75 | Active |
| New Hampshire | NH | $55 | Active |
| Connecticut | CT | $45 | Active |
| Pennsylvania | PA | $42 | Active |
| Michigan | MI | $30 | Active |
| Delaware | DE | $25 | Active |
| Indiana | IN | $20 | Active |
| Ohio | OH | $10 | Active |

### Calculation Formula

```typescript
interface SRECIncomeInput {
  state: string;
  systemSize: number; // kW
  annualProduction: number; // kWh
}

function calculateSRECIncome(input: SRECIncomeInput): SRECIncomeResult {
  // 1. Check if state is SREC-eligible
  const stateData = SREC_STATES[input.state];
  if (!stateData) return { eligible: false };

  // 2. Calculate SRECs generated (1 SREC = 1000 kWh)
  const srecsPerYear = input.annualProduction / 1000;

  // 3. Calculate annual income
  const annualIncome = srecsPerYear * stateData.srecPrice;

  // 4. Project 20 years with degradation
  const projection = [];
  for (let year = 1; year <= 20; year++) {
    const degradation = Math.pow(0.995, year - 1); // 0.5% per year
    const yearlyProduction = input.annualProduction * degradation;
    const yearlySRECs = yearlyProduction / 1000;
    const yearlyIncome = yearlySRECs * stateData.srecPrice;

    projection.push({
      year,
      production: yearlyProduction,
      srecs: yearlySRECs,
      income: yearlyIncome
    });
  }

  return {
    eligible: true,
    annualIncome,
    projection,
    totalIncome: projection.reduce((sum, p) => sum + p.income, 0)
  };
}
```

### Degradation Modeling

Solar panels degrade over time:
- **Year 1:** 100% production
- **Year 10:** 95.5% production
- **Year 20:** 91.0% production
- **Year 25:** 88.3% production

Formula: `production = annualProduction * Math.pow(0.995, year - 1)`

---

## Lead Capture System

### Data Flow

```
User Completes Form
    │
    ▼
Client-Side Validation (Zod)
    │
    ▼
POST /api/calculator/lead
    │
    ▼
Server-Side Validation
    │
    ▼
Supabase Insert
    │
    ├─ tenant_id = 'calculator'
    ├─ RLS Policy Check
    └─ Insert into lead_submissions
    │
    ▼
Success Response
    │
    ▼
Thank You Modal
```

### Lead Capture Form Schema

```typescript
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  address: z.string().min(5, 'Address required'),
  systemSizeKW: z.number().min(1).max(100),
  annualSavings: z.number().min(0)
});
```

### Tenant Isolation

All leads stored with `tenant_id = 'calculator'`:
- Prevents cross-contamination with other NetZero products
- Allows separate billing/analytics
- Enforced at database level with RLS

---

## Database Schema

### Table: `lead_submissions`

```sql
CREATE TABLE lead_submissions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tenant Isolation
  tenant_id TEXT NOT NULL DEFAULT 'calculator',

  -- Session Tracking
  session_id TEXT,

  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,

  -- Calculation Results
  system_size_kw DECIMAL(10, 2),
  annual_savings DECIMAL(10, 2),
  monthly_payment DECIMAL(10, 2),
  payback_period DECIMAL(10, 2),
  total_lifetime_savings DECIMAL(10, 2),

  -- Lead Management
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'calculator',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lead_submissions_tenant ON lead_submissions(tenant_id);
CREATE INDEX idx_lead_submissions_created ON lead_submissions(created_at DESC);
CREATE INDEX idx_lead_submissions_status ON lead_submissions(status);
CREATE INDEX idx_lead_submissions_email ON lead_submissions(email);

-- RLS Policies
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_select" ON lead_submissions
  FOR SELECT USING (tenant_id = 'calculator');

CREATE POLICY "tenant_isolation_insert" ON lead_submissions
  FOR INSERT WITH CHECK (tenant_id = 'calculator');

CREATE POLICY "tenant_isolation_update" ON lead_submissions
  FOR UPDATE USING (tenant_id = 'calculator');
```

---

## API Design

### Endpoints

#### 1. POST /api/calculator/lead

**Purpose:** Capture lead after calculation

**Request:**
```typescript
{
  name: string;
  email: string;
  phone?: string;
  address: string;
  systemSizeKW: number;
  annualSavings: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  leadId?: string;
  message: string;
  error?: string;
}
```

**Error Codes:**
- 400: Invalid request body
- 500: Database error

---

#### 2. GET /api/health

**Purpose:** Health check for monitoring

**Response:**
```typescript
{
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks?: {
    database: boolean;
    nrel_api: boolean;
  };
}
```

---

## Component Architecture

### Component Tree

```
App (layout.tsx)
│
├─ TenantProvider (context)
│
└─ CalculatorLanding (page.tsx)
    │
    ├─ Hero Section
    │   ├─ Heading
    │   ├─ Subheading
    │   └─ CTA Button
    │
    ├─ AddressInput
    │   ├─ Google Maps Autocomplete
    │   └─ Address Validation
    │
    ├─ EnhancedCalculatorForm
    │   ├─ System Size Slider
    │   ├─ Monthly Bill Input
    │   ├─ State Selector
    │   └─ Calculate Button
    │
    ├─ ResultsDisplay
    │   ├─ Annual Savings
    │   ├─ Payback Period
    │   ├─ Lifetime Value
    │   └─ SRECIncome (if eligible)
    │
    └─ LeadCaptureForm (modal)
        ├─ Name Input
        ├─ Email Input
        ├─ Phone Input
        └─ Submit Button
```

### Component Patterns

#### 1. Client Components (`'use client'`)
- All interactive components
- Forms with state management
- API calls from browser

#### 2. Server Components (default)
- Static content
- SEO-optimized sections
- Reduced JavaScript bundle

#### 3. Shared Components
- UI primitives (Button, Card, Input)
- Utility components (TenantProvider)

---

## Testing Strategy

### Test Pyramid

```
           /\
          /  \
         / E2E \ (Future: Playwright)
        /--------\
       /          \
      / Integration \ (API routes)
     /--------------\
    /                \
   /   Unit Tests     \ (23 tests)
  /____________________\
```

### Current Coverage (23 Tests)

#### Unit Tests (20 tests) - `calculations.test.ts`
1. NREL API integration
2. SREC income calculations
3. State-specific pricing
4. Financial projections
5. Edge case handling

#### Component Tests (3 tests) - `CalculatorComponents.test.tsx`
1. Component rendering
2. User interactions
3. Form validation

### Testing Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npx vitest run src/lib/calculations.test.ts

# Watch mode
npx vitest watch
```

### Future Testing (Phase 2)

- **E2E Tests:** Playwright for full user flows
- **Visual Regression:** Percy for UI changes
- **Performance Tests:** Lighthouse CI for bundle size

---

## Deployment Architecture

### Vercel Platform

```
GitHub (main branch)
    │
    │ Push/Merge
    ▼
Vercel Build Pipeline
    │
    ├─ Install Dependencies
    ├─ Type Check
    ├─ Run Tests
    ├─ Build Next.js App
    └─ Deploy to Edge Network
    │
    ▼
Production
    ├─ Edge Functions (API routes)
    ├─ Static Assets (CDN)
    └─ Environment Variables
```

### Environment Variables (Vercel)

**Required:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tedulbfhqhfrkvuydsis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
PVWATTS_API_KEY=<nrel-api-key>
```

**Optional:**
```bash
GOOGLE_API_KEY=<google-api-key>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<maps-key>
OPENEI_API_KEY=<openei-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Deployment Flow

1. **Development:** Local testing with `npm run dev`
2. **Preview:** Automatic preview deployments for PRs
3. **Production:** Manual deploy via `vercel --prod` or auto-deploy on main merge

---

## Security & Compliance

### Critical Rules

1. **NO OpenAI** - This project NEVER uses OpenAI models or APIs
2. **API Keys in .env ONLY** - Never hardcode secrets
3. **Tenant Isolation** - All database queries enforce `tenant_id = 'calculator'`
4. **Input Validation** - Zod schemas on all user inputs
5. **Rate Limiting** - API routes protected (future: Vercel Edge Config)

### Security Measures

**Client-Side:**
- CSP headers for XSS protection
- HTTPS only
- Secure cookies for sessions
- Input sanitization

**Server-Side:**
- Environment variable validation
- SQL injection prevention (Supabase parameterized queries)
- RLS policies on all tables
- API key rotation policy

**Database:**
- Row Level Security (RLS) enabled
- Tenant isolation enforced
- Encrypted at rest
- Regular backups

### Data Privacy

- No PII stored without consent
- GDPR-compliant lead capture
- User can request data deletion
- Transparent privacy policy

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint** | < 1.5s | 1.2s |
| **Time to Interactive** | < 3.0s | 2.8s |
| **Bundle Size (main page)** | < 20KB | 13.6KB |
| **API Response Time** | < 500ms | 350ms |
| **Test Suite Runtime** | < 10s | 8s |

---

## Future Roadmap

### Phase 2: Enhanced Features
- Battery storage calculator
- Financing options comparison
- Installer marketplace integration
- Real-time utility rate API

### Phase 3: Mobile App
- React Native app
- Offline calculations
- Push notifications for SREC price changes

### Phase 4: Enterprise Features
- White-label calculator for installers
- API access for partners
- Advanced analytics dashboard

---

## Maintenance & Support

**Code Review:** All changes require review before merge
**Testing:** 100% test coverage for business logic
**Documentation:** Update CLAUDE.md for all feature changes
**Monitoring:** Vercel Analytics + Sentry error tracking

---

## Contact & Resources

- **Production:** https://netzero-calculator.vercel.app
- **GitHub:** https://github.com/ScientiaCapital/netzero-calculator
- **Vercel:** https://vercel.com/scientia-capital/netzero-calculator
- **Supabase:** https://app.supabase.com/project/tedulbfhqhfrkvuydsis
- **Documentation:** CLAUDE.md
