/**
 * Domain Types
 *
 * Type definitions for the NetZero Calculator domain.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// API TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

export const UuidSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const USPhoneSchema = z.string().regex(/^\+?1?\d{10}$/);
export const ZipCodeSchema = z.string().regex(/^\d{5}(-\d{4})?$/);

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: ZipCodeSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): Result<T, z.ZodError> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function getErrorMessages(error: z.ZodError): string[] {
  return error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type USState = string; // Could be enum of 50 states

export interface Address {
  street: string;
  city: string;
  state: USState;
  zipCode: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface DomainUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
