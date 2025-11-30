# netzero-calculator

**Branch**: main | **Updated**: 2025-11-30

## Status
Production-ready standalone Next.js 15 application for instant solar savings calculations with SREC income projections. Successfully extracted from netzeroexpert-os monolith and deployed to production.

## Today's Focus
1. [ ] Set environment variables in Vercel dashboard
2. [ ] Connect custom domain netzerocalculator.com
3. [ ] Configure Supabase redirect URLs
4. [ ] Test lead submission in production

## Done (This Session)
- (none yet)

## Critical Rules
- **NO OpenAI** - Use NREL, Google Solar, or Anthropic APIs only
- API keys in `.env` ONLY - Never hardcode secrets
- **Tenant Isolation** - All queries must respect `tenant_id = 'calculator'`
- **Test Before Deploy** - All 23 tests must pass

## Blockers
(none)

## Quick Commands
```bash
# Development
npm install
npm run dev              # http://localhost:3000

# Testing
npm test                 # 23 tests
npm run test:coverage

# Type checking
npm run type-check

# Production
npm run build
vercel --prod
```

## Tech Stack
- **Framework**: Next.js 15 + React
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL (Project: tedulbfhqhfrkvuydsis)
- **Styling**: Tailwind CSS + shadcn/ui
- **APIs**: NREL PVWatts, Google Solar API, OpenEI
- **Testing**: Vitest + @testing-library/react
- **Deployment**: Vercel
- **Production**: https://netzero-calculator.vercel.app
- **Custom Domain**: https://netzerocalculator.com (pending DNS)
