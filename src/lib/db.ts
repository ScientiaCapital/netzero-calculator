/**
 * Database utilities for NetZero Calculator
 */

export { createBrowserClient, createServerClient, getUser, getSession } from './supabase';

// Re-export for backward compatibility
export const db = {
  // Add database utilities as needed
};

export default db;
