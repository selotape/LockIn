/**
 * Frontend Service Factory
 * Creates service instances based on configuration (real vs mock)
 */

import { IAuthService } from './interfaces/IAuthService';
import { IApiClient } from './interfaces/IApiClient';
import { IStorageService } from './interfaces/IStorageService';

import { GoogleAuthService } from './auth/GoogleAuthService';
import { MockAuthService } from './auth/MockAuthService';

import { ApiClient } from './api/ApiClient';
import { MockApiClient } from './api/MockApiClient';

import { LocalStorageService } from './storage/LocalStorageService';
import { InMemoryStorageService } from './storage/InMemoryStorageService';

import { AppConfig } from '@/frontend/config/app.config';

/**
 * Service factory for frontend services
 * Switches between real and mock implementations based on USE_MOCKS config
 */
export class ServiceFactory {
  private static readonly USE_MOCKS = AppConfig.USE_MOCKS;
  private static readonly API_BASE_URL = AppConfig.API_BASE_URL;

  // Singleton instances
  private static authService: IAuthService | null = null;
  private static apiClient: IApiClient | null = null;
  private static storageService: IStorageService | null = null;

  /**
   * Get authentication service (singleton)
   */
  static getAuthService(): IAuthService {
    if (!this.authService) {
      this.authService = this.USE_MOCKS
        ? new MockAuthService()
        : new GoogleAuthService();

      console.log(
        `[ServiceFactory] Created ${this.USE_MOCKS ? 'Mock' : 'Google'} Auth Service`
      );
    }
    return this.authService;
  }

  /**
   * Get API client (singleton)
   */
  static getApiClient(): IApiClient {
    if (!this.apiClient) {
      this.apiClient = this.USE_MOCKS
        ? new MockApiClient()
        : new ApiClient(this.API_BASE_URL);

      console.log(
        `[ServiceFactory] Created ${this.USE_MOCKS ? 'Mock' : 'Real'} API Client` +
          (this.USE_MOCKS ? '' : ` (${this.API_BASE_URL})`)
      );
    }
    return this.apiClient;
  }

  /**
   * Get storage service (singleton)
   */
  static getStorageService(): IStorageService {
    if (!this.storageService) {
      this.storageService = this.USE_MOCKS
        ? new InMemoryStorageService()
        : new LocalStorageService();

      console.log(
        `[ServiceFactory] Created ${this.USE_MOCKS ? 'InMemory' : 'LocalStorage'} Storage Service`
      );
    }
    return this.storageService;
  }

  /**
   * Log service factory configuration
   */
  static logConfiguration(): void {
    console.log('Frontend Service Factory Configuration:');
    console.log(`  USE_MOCKS: ${this.USE_MOCKS}`);
    console.log(`  API_BASE_URL: ${this.API_BASE_URL}`);
    console.log(
      `  Auth Service: ${this.USE_MOCKS ? 'MockAuthService' : 'GoogleAuthService'}`
    );
    console.log(
      `  API Client: ${this.USE_MOCKS ? 'MockApiClient' : 'ApiClient'}`
    );
    console.log(
      `  Storage Service: ${this.USE_MOCKS ? 'InMemoryStorageService' : 'LocalStorageService'}`
    );
  }

  /**
   * Reset all services (useful for testing)
   */
  static reset(): void {
    this.authService = null;
    this.apiClient = null;
    this.storageService = null;
    console.log('[ServiceFactory] All services reset');
  }
}
