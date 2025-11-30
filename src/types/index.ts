/**
 * Domain Types
 *
 * Import shared types from @netzero/core and define domain-specific types here.
 */

// Re-export shared types
export type {
  ApiResponse,
  ApiError,
  Result,
  USState,
  Address,
  ContactInfo,
} from '@netzero/core/types';

// Re-export validation schemas
export {
  UuidSchema,
  EmailSchema,
  USPhoneSchema,
  ZipCodeSchema,
  AddressSchema,
  safeParse,
  getErrorMessages,
} from '@netzero/core/validation';

// Domain-specific types
// TODO: Add your domain-specific types here

/**
 * Example domain-specific type
 */
export interface DomainUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  // Add domain-specific fields
}
