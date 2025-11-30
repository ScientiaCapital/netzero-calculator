/**
 * Supabase Browser Client
 *
 * Uses @netzero/database for standardized Supabase access.
 * This file re-exports for convenience and adds domain-specific configuration.
 */

import { createBrowserClient, getCurrentUser, getCurrentSession, signOut } from '@netzero/database/client';

// Re-export for convenience
export { createBrowserClient, getCurrentUser, getCurrentSession, signOut };

/**
 * Get Supabase client for browser usage
 *
 * @example
 * ```tsx
 * import { getSupabase } from '@/lib/supabase/client';
 *
 * const supabase = getSupabase();
 * if (supabase) {
 *   const { data } = await supabase.from('users').select('*');
 * }
 * ```
 */
export function getSupabase() {
  return createBrowserClient();
}
