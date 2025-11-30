# Validate - Multi-Phase Validation Workflow

Execute comprehensive validation across type checking, build, tests, environment, and health checks.

---

## Critical Rules (Read First)

1. **NO OpenAI** - This project NEVER uses OpenAI models or APIs
2. **API Keys in .env ONLY** - Never hardcode secrets anywhere
3. **Tenant Isolation** - All Supabase queries must respect `tenant_id = 'calculator'`
4. **23 Tests Must Pass** - Zero tolerance for test failures

---

## Validation Phases

### Phase 1: Type Check
```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator
npm run type-check
```

**Expected Output:**
- Zero TypeScript errors
- All type definitions resolved

**Common Issues:**
- Missing `@types/*` packages
- Incorrect prop types in components
- Supabase client type mismatches

---

### Phase 2: Production Build
```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator
npm run build
```

**Expected Output:**
- Route bundle sizes (main page ~13.6 kB)
- Zero build errors
- Zero warnings

**Build Targets:**
- `/` (CalculatorLanding)
- `/api/calculator/lead`
- `/api/health`

---

### Phase 3: Test Suite (23 Tests)
```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator
npm test
```

**Expected Coverage:**
- `calculations.test.ts` - 20 tests (NREL API, SREC, financials)
- `CalculatorComponents.test.tsx` - 3 tests (component rendering)

**Test Categories:**
1. NREL PVWatts API integration
2. SREC income calculations (15 states)
3. State-specific pricing (50 states)
4. Financial projections (ROI, payback)
5. Component rendering (Address input, SREC display)

**Critical Test Cases:**
- Massachusetts SREC income (highest rate)
- New Jersey SREC income (established market)
- California solar pricing (highest adoption)
- Fallback calculations (when API unavailable)

---

### Phase 4: Environment Variables Check
```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator
node -e "
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'PVWATTS_API_KEY'
];

console.log('Environment Variable Check');
console.log('==========================');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found');
  console.log('📋 Copy .env.example to .env.local and configure');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const missing = requiredVars.filter(v => !envContent.includes(v));

if (missing.length > 0) {
  console.error('❌ Missing required variables:', missing.join(', '));
  process.exit(1);
}

console.log('✅ All required environment variables present');
console.log('');
console.log('Configured variables:');
requiredVars.forEach(v => {
  const present = envContent.includes(v);
  console.log(\`  \${present ? '✅' : '❌'} \${v}\`);
});
"
```

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
- `PVWATTS_API_KEY` - NREL API key for production calculations

**Optional (Enhances Functionality):**
- `GOOGLE_API_KEY` - Google Solar API
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Address autocomplete
- `OPENEI_API_KEY` - Utility rate data
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin operations

---

### Phase 5: Health Check
```bash
cd /Users/tmkipper/Desktop/tk_projects/netzero-calculator

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check health endpoint
curl -s http://localhost:3000/api/health | jq

# Kill dev server
kill $DEV_PID
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-30T12:00:00Z"
}
```

---

## Validation Summary Report

After all phases, generate this report:

```
NetZero Calculator - Validation Report
=======================================
Date: [timestamp]
Environment: [development/production]

Phase 1: Type Check             [✅/❌]
Phase 2: Build                  [✅/❌]
Phase 3: Tests (23)             [✅/❌]
Phase 4: Environment Variables  [✅/❌]
Phase 5: Health Check           [✅/❌]

Critical Rules Compliance:
- NO OpenAI usage               [✅/❌]
- API keys in .env only         [✅/❌]
- Tenant isolation enforced     [✅/❌]
- All 23 tests passing          [✅/❌]

Deployment Ready:               [YES/NO]
```

---

## Rollback on Failure

If ANY phase fails:

1. **Stop immediately** - Do not proceed to next phase
2. **Document failure** - Capture error messages
3. **Investigate root cause** - Check relevant files
4. **Fix issue** - Make minimal changes
5. **Re-run validation** - Start from Phase 1

---

## Production Deployment Checklist

Before deploying to Vercel:

- [ ] All 5 phases passing
- [ ] Environment variables configured in Vercel dashboard
- [ ] Custom domain DNS configured (netzerocalculator.com)
- [ ] Supabase RLS policies enabled
- [ ] NREL API key valid and not rate-limited
- [ ] Test lead submission in production
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry)

---

## Usage

```bash
# Run full validation
/.claude/commands/validate.md

# Or invoke via Claude Code
/validate
```

---

## Emergency Contacts

- **Vercel Dashboard**: https://vercel.com/scientia-capital/netzero-calculator
- **Supabase Dashboard**: https://app.supabase.com/project/tedulbfhqhfrkvuydsis
- **NREL API Status**: https://developer.nrel.gov/
