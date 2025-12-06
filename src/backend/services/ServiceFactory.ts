/**
 * Service Factory
 * Creates service instances based on environment configuration
 * Switches between real and mock implementations using USE_MOCKS flag
 */

import { IFitnessService } from './interfaces/IFitnessService';
import { IAuthService } from './interfaces/IAuthService';
import { GoogleFitnessService } from './fitness/GoogleFitnessService';
import { MockFitnessService } from './fitness/MockFitnessService';
import { GoogleAuthService } from './auth/GoogleAuthService';
import { MockAuthService } from './auth/MockAuthService';
import { AppConfig } from '@/backend/infrastructure/config/app.config';

/**
 * Factory for creating service instances
 * Environment-based switching between real and mock implementations
 */
export class ServiceFactory {
  private static useMocks = AppConfig.USE_MOCKS;

  /**
   * Get fitness service implementation
   * @returns Fitness service (real or mock based on config)
   */
  static getFitnessService(): IFitnessService {
    if (this.useMocks) {
      console.log('🎭 ServiceFactory: Using MockFitnessService');
      return new MockFitnessService();
    } else {
      console.log('🌐 ServiceFactory: Using GoogleFitnessService');
      return new GoogleFitnessService();
    }
  }

  /**
   * Get authentication service implementation
   * @returns Auth service (real or mock based on config)
   */
  static getAuthService(): IAuthService {
    if (this.useMocks) {
      console.log('🎭 ServiceFactory: Using MockAuthService');
      return new MockAuthService();
    } else {
      console.log('🌐 ServiceFactory: Using GoogleAuthService');
      return new GoogleAuthService();
    }
  }

  /**
   * Check if mocks are enabled
   * @returns True if using mocks
   */
  static isUsingMocks(): boolean {
    return this.useMocks;
  }

  /**
   * Log current factory configuration
   */
  static logConfiguration(): void {
    console.log('🏭 ServiceFactory Configuration:');
    console.log(`  USE_MOCKS: ${this.useMocks}`);
    console.log(
      `  FitnessService: ${this.useMocks ? 'Mock' : 'Google'}`
    );
    console.log(
      `  AuthService: ${this.useMocks ? 'Mock' : 'Google'}`
    );
  }
}
