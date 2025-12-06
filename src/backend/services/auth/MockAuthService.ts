/**
 * Mock Authentication service implementation
 * Always validates successfully for local development
 */

import { IAuthService } from '../interfaces/IAuthService';
import { User } from '@/shared/types/User.types';

/**
 * Mock authentication service for local development
 * Always returns successful validation and mock user data
 */
export class MockAuthService implements IAuthService {
  private readonly mockUser: User = {
    id: 'mock-user-123',
    email: 'mockuser@example.com',
    name: 'Mock User',
    picture: 'https://via.placeholder.com/150',
  };

  /**
   * Always validates tokens successfully
   * @param accessToken - Ignored (always returns true)
   * @returns Promise resolving to true
   */
  async validateToken(accessToken: string): Promise<boolean> {
    console.log('🎭 MockAuthService: Validating token (always succeeds)');

    // Simulate minimal validation
    if (!accessToken || accessToken.trim() === '') {
      console.log('  ⚠️ Empty token provided');
      return false;
    }

    // Simulate network delay
    await this.simulateDelay(50);

    console.log('  ✓ Token validated successfully');
    return true;
  }

  /**
   * Always returns mock user info
   * @param accessToken - Ignored (always returns mock user)
   * @returns Promise resolving to mock user
   */
  async getUserInfo(accessToken: string): Promise<User | null> {
    console.log('🎭 MockAuthService: Getting user info (mock data)');

    // Simulate minimal validation
    if (!accessToken || accessToken.trim() === '') {
      console.log('  ⚠️ Empty token provided');
      return null;
    }

    // Simulate network delay
    await this.simulateDelay(50);

    console.log(`  ✓ Returning mock user: ${this.mockUser.name}`);
    return { ...this.mockUser };
  }

  /**
   * Simulate network delay for more realistic testing
   * @param ms - Milliseconds to delay
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
