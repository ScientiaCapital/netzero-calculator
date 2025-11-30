/**
 * Supabase Client Utilities
 *
 * Standalone Supabase configuration for the Calculator domain.
 * Provides both browser and server clients.
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const ENV_KEYS = {
  URL: 'NEXT_PUBLIC_SUPABASE_URL',
  ANON_KEY: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
} as const;

interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

interface DatabaseConfigResult {
  success: boolean;
  config?: DatabaseConfig;
  errors?: string[];
}

function getDatabaseConfig(): DatabaseConfigResult {
  const errors: string[] = [];

  const url = process.env[ENV_KEYS.URL];
  const anonKey = process.env[ENV_KEYS.ANON_KEY];
  const serviceRoleKey = process.env[ENV_KEYS.SERVICE_ROLE_KEY];

  if (!url) {
    errors.push(`Missing: ${ENV_KEYS.URL}`);
  }

  if (!anonKey) {
    errors.push(`Missing: ${ENV_KEYS.ANON_KEY}`);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const config = serviceRoleKey
    ? { url: url!, anonKey: anonKey!, serviceRoleKey }
    : { url: url!, anonKey: anonKey! };

  return { success: true, config };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER CLIENT
// ─────────────────────────────────────────────────────────────────────────────

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

/**
 * Create a Supabase client for server-side usage (API routes, Server Components).
 */
export async function createServerClient() {
  const result = getDatabaseConfig();
  if (!result.success) {
    throw new Error(`Supabase not configured: ${result.errors?.join(', ')}`);
  }

  // Dynamic import for Next.js cookies
  let cookieStore: CookieStore;
  try {
    const { cookies } = await import('next/headers');
    cookieStore = (await cookies()) as CookieStore;
  } catch {
    throw new Error('Cannot access cookies. Must be used in Next.js environment.');
  }

  const { url, anonKey } = result.config!;

  return createSupabaseServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Record<string, unknown>)
          );
        } catch {
          // Called from Server Component - can't set cookies (expected)
        }
      },
    },
  });
}

/**
 * Create a Supabase client with service role (admin) privileges.
 */
export function createServiceClient() {
  const url = process.env[ENV_KEYS.URL];
  const serviceRoleKey = process.env[ENV_KEYS.SERVICE_ROLE_KEY];

  if (!url || !serviceRoleKey) {
    throw new Error('Service client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BROWSER CLIENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a Supabase client for browser-side usage.
 */
export function createBrowserClient() {
  const url = process.env[ENV_KEYS.URL];
  const anonKey = process.env[ENV_KEYS.ANON_KEY];

  if (!url || !anonKey) {
    throw new Error('Browser client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current authenticated user (server-side).
 */
export async function getUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current session (server-side).
 */
export async function getSession() {
  const supabase = await createServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}

// Re-export types
export type { User, Session } from '@supabase/supabase-js';
