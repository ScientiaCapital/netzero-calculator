/**
 * Supabase Browser Client
 *
 * Re-exports browser utilities for convenience.
 */

import { createBrowserClient } from './index';

// Re-export for convenience
export { createBrowserClient };

/**
 * Get Supabase client for browser usage
 */
export function getSupabase() {
  return createBrowserClient();
}
