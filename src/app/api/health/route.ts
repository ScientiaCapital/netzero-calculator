import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 *
 * Returns the health status of the application.
 * Used by load balancers and monitoring systems.
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    domain: 'Calculator',
    checks: {
      app: 'ok',
      // Add database check when Supabase is configured
      // database: await checkDatabase(),
    },
  };

  return NextResponse.json(health);
}
