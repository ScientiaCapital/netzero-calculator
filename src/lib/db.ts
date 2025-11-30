/**
 * Database stub - Will be implemented with @netzero/database
 * This file provides type compatibility during migration
 */

import { createBrowserClient, createServerClient } from '@netzero/database';

export { createBrowserClient, createServerClient };

// Re-export for backward compatibility
export const db = {
  // Add database utilities as needed
};

export default db;
