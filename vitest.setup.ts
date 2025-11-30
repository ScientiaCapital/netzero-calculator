import '@testing-library/jest-dom/vitest';

// Mock environment variables for tests
process.env.PVWATTS_API_KEY = 'test-api-key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
