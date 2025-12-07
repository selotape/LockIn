/**
 * Mock Authentication Service
 * Mock implementation for local development without Google
 */

import { IAuthService } from '../interfaces/IAuthService';
import { AuthCredentials } from '@/shared/types/User.types';

/**
 * Mock authentication service
 * Simulates Google Sign-In without actual authentication
 */
export class MockAuthService implements IAuthService {
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private signedIn: boolean = false;

  /**
   * Initialize (no-op for mock)
   */
  async initialize(): Promise<void> {
    console.log('[MOCK] Auth service initialized');
    return Promise.resolve();
  }

  /**
   * Mock sign in
   * Returns fake credentials immediately
   */
  async signIn(): Promise<AuthCredentials> {
    console.log('[MOCK] User signing in...');

    // Simulate async delay
    await this.delay(500);

    // Generate mock tokens
    this.idToken = this.generateMockToken('id');
    this.accessToken = this.generateMockToken('access');
    this.signedIn = true;

    console.log('[MOCK] User signed in successfully');

    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
    };
  }

  /**
   * Mock sign out
   */
  signOut(): void {
    console.log('[MOCK] User signing out...');
    this.accessToken = null;
    this.idToken = null;
    this.signedIn = false;
    console.log('[MOCK] User signed out');
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.signedIn;
  }

  /**
   * Get mock access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Generate a mock JWT-like token
   */
  private generateMockToken(type: 'id' | 'access'): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: 'mock-user-123',
        email: 'mock.user@example.com',
        name: 'Mock User',
        picture: 'https://via.placeholder.com/150',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        type: type,
      })
    );
    const signature = btoa('mock-signature');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Simulate async delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
