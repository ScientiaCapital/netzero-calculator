/**
 * Supabase Server Client
 *
 * Uses @netzero/database for standardized Supabase access.
 * This file re-exports for convenience and adds domain-specific configuration.
 */

import {
  createServerClient,
  createServiceClient,
  getUser,
  getSession,
  requireAuth,
  isAuthenticated,
} from '@netzero/database/server';

// Re-export for convenience
export {
  createServerClient,
  createServiceClient,
  getUser,
  getSession,
  requireAuth,
  isAuthenticated,
};

/**
 * Create a Supabase client for API routes and Server Components
 *
 * @example
 * ```ts
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function GET() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('users').select('*');
 *   return Response.json(data);
 * }
 * ```
 */
export async function createClient() {
  return createServerClient();
}
