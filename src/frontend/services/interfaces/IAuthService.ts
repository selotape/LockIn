/**
 * Frontend Authentication Service Interface
 * Abstracts Google Sign-In functionality
 */

import { AuthCredentials } from '@/shared/types/User.types';

/**
 * Interface for frontend authentication services
 * Implementations: GoogleAuthService (real), MockAuthService (mock)
 */
export interface IAuthService {
  /**
   * Initialize the authentication service
   * Must be called before any other methods
   */
  initialize(): Promise<void>;

  /**
   * Sign in the user
   * @returns Promise resolving to auth credentials
   */
  signIn(): Promise<AuthCredentials>;

  /**
   * Sign out the current user
   */
  signOut(): void;

  /**
   * Check if user is currently signed in
   * @returns True if user is signed in
   */
  isSignedIn(): boolean;

  /**
   * Get the current access token
   * @returns Access token or null if not signed in
   */
  getAccessToken(): string | null;
}
