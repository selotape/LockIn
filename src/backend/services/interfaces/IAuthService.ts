/**
 * Authentication service interface
 * Abstracts authentication and token validation
 */

import { User } from '@/shared/types/User.types';

/**
 * Interface for authentication services
 * Implementations: GoogleAuthService (real), MockAuthService (mock)
 */
export interface IAuthService {
  /**
   * Validate an access token
   * @param accessToken - OAuth2 access token to validate
   * @returns Promise resolving to true if valid, false otherwise
   */
  validateToken(accessToken: string): Promise<boolean>;

  /**
   * Get user information from an access token
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to user info, or null if invalid
   */
  getUserInfo(accessToken: string): Promise<User | null>;
}
