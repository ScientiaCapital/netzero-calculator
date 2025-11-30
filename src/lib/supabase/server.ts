/**
 * Supabase Server Client
 *
 * Re-exports server utilities for convenience.
 */

import { createServerClient, createServiceClient, getUser, getSession } from './index';

// Re-export for convenience
export { createServerClient, createServiceClient, getUser, getSession };

/**
 * Create a Supabase client for API routes and Server Components
 */
export async function createClient() {
  return createServerClient();
}
