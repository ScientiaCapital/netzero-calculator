# CLAUDE.md - NetZero Calculator

## Project Overview

**NetZero Calculator** is a standalone Next.js 15 application for instant solar savings calculations with SREC income projections. This is the first domain successfully extracted from the netzeroexpert-os monolith.

**Domain:** NetZeroCalculator.com
**Status:** ✅ Production-Ready (Deployed November 30, 2025)
**Tech Stack:** Next.js 15 + TypeScript + Supabase + Tailwind CSS

---

## Quick Links

| Resource | URL |
|----------|-----|
| **Production** | https://netzero-calculator.vercel.app |
| **Custom Domain** | https://netzerocalculator.com (pending DNS) |
| **GitHub** | https://github.com/ScientiaCapital/netzero-calculator |
| **Vercel Dashboard** | https://vercel.com/scientia-capital/netzero-calculator |
| **Supabase** | Project ID: `tedulbfhqhfrkvuydsis` |

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Run tests (23 tests)
npm test

# Production build
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Project Structure

```
netzero-calculator/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/
│   │   │   ├── calculator/lead/route.ts    # Lead capture API
│   │   │   └── health/route.ts             # Health check
│   │   ├── layout.tsx       # Root layout with TenantProvider
│   │   ├── page.tsx         # Home page (CalculatorLanding)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── calculator/      # Calculator-specific components
│   │   │   ├── CalculatorLanding.tsx      # Main landing page
│   │   │   ├── AddressInput.tsx           # Address autocomplete
│   │   │   ├── EnhancedCalculatorForm.tsx # Main form
│   │   │   ├── LeadCaptureForm.tsx        # Lead capture modal
│   │   │   └── SRECIncome.tsx             # SREC visualization
│   │   ├── shared/          # Shared components
│   │   │   └── TenantProvider.tsx         # Tenant context
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── lib/                 # Core business logic
│   │   ├── calculations.ts        # SolarCalculator (NREL PVWatts)
│   │   ├── srec-calculator.ts     # SREC income calculations
│   │   ├── srec-states.ts         # State SREC program data
│   │   ├── state-pricing.ts       # State-specific pricing
│   │   ├── solar-api.ts           # Google Solar API
│   │   └── supabase/              # Supabase client utilities
│   │       ├── index.ts           # Main exports
│   │       ├── client.ts          # Browser client
│   │       └── server.ts          # Server client
│   ├── services/
│   │   └── calculator/
│   │       └── calculator.adapter.ts  # Adapter pattern for calculator
│   └── types/
│       └── index.ts          # Type definitions
├── vitest.config.ts          # Vitest configuration
├── vitest.setup.ts           # Test setup (jest-dom)
└── package.json
```

---

## Environment Variables

Create `.env.local` with these variables:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://tedulbfhqhfrkvuydsis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NREL API (Required for production calculations)
PVWATTS_API_KEY=your-nrel-api-key

# Google APIs (Optional - enhances functionality)
GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
OPENEI_API_KEY=your-openei-key

# Service Role (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get API keys from:
- **NREL PVWatts**: https://developer.nrel.gov/signup/
- **Google Cloud**: https://console.cloud.google.com/
- **OpenEI**: https://openei.org/services/

---

## Key Features

### 1. Solar Calculation Engine
- **NREL PVWatts API Integration** - Real solar irradiance data
- **State-Specific Pricing** - All 50 US states
- **System Size Optimization** - Based on utility bill
- **Fallback Calculations** - Works without API keys

### 2. SREC Income Calculator
- **15 SREC-Eligible States** - NJ, MA, DC, MD, PA, OH, IL, DE, NC, CT, NH, RI, WV, MI, IN
- **20-Year Projections** - With degradation modeling
- **Market Price Data** - Current SREC prices by state

### 3. Lead Capture
- **Supabase Integration** - Secure lead storage
- **Tenant Isolation** - `tenant_id = 'calculator'`
- **Form Validation** - Zod schemas

---

## Testing

**23 tests passing** across 2 test suites:

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| `calculations.test.ts` | 20 | NREL API, SREC, financials |
| `CalculatorComponents.test.tsx` | 3 | Component rendering |

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/lib/calculations.test.ts
```

---

## API Endpoints

### POST /api/calculator/lead
Capture lead information after calculation.

```typescript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "address": "123 Main St",
  "systemSizeKW": 7.5,
  "annualSavings": 1200
}

// Response
{
  "success": true,
  "leadId": "uuid",
  "message": "Lead submitted successfully"
}
```

### GET /api/health
Health check endpoint.

```typescript
// Response
{
  "status": "healthy",
  "timestamp": "2025-11-30T12:00:00Z"
}
```

---

## Database Schema

### Table: `lead_submissions`
```sql
CREATE TABLE lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'calculator',
  session_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  system_size_kw DECIMAL,
  annual_savings DECIMAL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON lead_submissions
  USING (tenant_id = 'calculator');
```

---

## Next Steps (Tomorrow's Build)

### Priority 1: Production Configuration
- [ ] Set environment variables in Vercel dashboard
- [ ] Connect custom domain `netzerocalculator.com`
- [ ] Configure Supabase redirect URLs
- [ ] Test lead submission in production

### Priority 2: Analytics & Monitoring
- [ ] Add Vercel Analytics
- [ ] Configure Sentry error tracking
- [ ] Set up uptime monitoring

### Priority 3: Feature Enhancements
- [ ] Add loading skeletons for better UX
- [ ] Implement API response caching
- [ ] Add E2E tests with Playwright
- [ ] SEO: sitemap.xml and robots.txt

### Priority 4: Other Domain Extractions
After Calculator is fully production-stable, extract:
1. **netzero-voice** (SolarVoice.ai) - Voice-first field operations
2. **netzero-bot** (NetZeroBot.com) - AI agents marketplace
3. **netzero-appraisal** (SolarAppraisal.ai) - Property valuation

---

## Critical Rules

- **NO OpenAI** - Use NREL, Google Solar, or Anthropic APIs only
- **API Keys in .env ONLY** - Never hardcode secrets
- **Tenant Isolation** - All queries must respect `tenant_id`
- **Test Before Deploy** - All 23 tests must pass

---

## Deployment History

| Date | Version | Changes | Status |
|------|---------|---------|--------|
| 2025-11-30 | 1.0.0 | Initial deployment | ✅ Live |

---

## Team Notes

**Extraction Completed:** November 30, 2025
**Reviewer Approval:** Code Reviewer - 100% APPROVED
**Build Status:** 23/23 tests passing, 0 TypeScript errors, 13.6 kB bundle

This project is **production-ready** and can accept traffic immediately after environment variables are configured in Vercel.

---

## Support

- **GitHub Issues**: https://github.com/ScientiaCapital/netzero-calculator/issues
- **Vercel Logs**: https://vercel.com/scientia-capital/netzero-calculator/logs
- **Supabase Dashboard**: https://app.supabase.com/project/tedulbfhqhfrkvuydsis
