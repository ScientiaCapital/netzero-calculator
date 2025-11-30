# NetZero Calculator

Calculate your solar savings in seconds with SREC income projections

## Quick Start

1. **Copy this template:**
   ```bash
   cp -r templates/nextjs-15-domain ../netzero-{{domain}}
   cd ../netzero-{{domain}}
   ```

2. **Replace placeholders:**
   - `Calculator` → Your domain name (e.g., `Calculator`, `Voice`, `Bot`, `Appraisal`)
   - `Instant Solar Savings` → Short tagline for SEO
   - `Calculate your solar savings in seconds with SREC income projections` → Full description

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Start development:**
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── api/           # API routes
│   │   └── health/    # Health check endpoint
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Landing page
│   └── globals.css    # Global styles
├── components/        # React components
├── lib/               # Utilities and services
│   └── supabase/     # Supabase client wrappers
└── types/            # TypeScript types
```

## Shared Packages

This project uses shared NetZero packages:

- **@netzero/core** - Shared utilities, types, and validation schemas
- **@netzero/database** - Supabase client with proper SSR support

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key |

## Development

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm type-check   # TypeScript validation
pnpm test         # Run tests
pnpm lint         # Lint code
```

## Deployment

This project is configured for Vercel deployment:

```bash
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## License

MIT - NetZero Platform
