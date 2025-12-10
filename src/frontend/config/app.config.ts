/**
 * Frontend Application Configuration
 * Loads config from environment variables and window globals
 */

declare global {
  interface Window {
    ENV?: {
      GOOGLE_CLIENT_ID?: string;
      CLOUD_FUNCTION_URL?: string;
      USE_MOCKS?: string;
    };
  }

  // Webpack DefinePlugin will replace these at build time
  // Using var declarations to avoid TS errors
  var process: {
    env: {
      USE_MOCKS?: string;
      GOOGLE_CLIENT_ID?: string;
      API_BASE_URL?: string;
    };
  };
}

/**
 * Frontend configuration class
 */
export class AppConfig {
  /**
   * Whether to use mock services (for development)
   */
  static readonly USE_MOCKS: boolean = (() => {
    const windowMocks = typeof window !== 'undefined' && window.ENV?.USE_MOCKS === 'true';
    const processMocks = process.env.USE_MOCKS === 'true';
    console.log('🔍 AppConfig USE_MOCKS calculation:', {
      windowMocks,
      processMocks,
      'process.env.USE_MOCKS': process.env.USE_MOCKS,
      'typeof process.env.USE_MOCKS': typeof process.env.USE_MOCKS,
      'window.ENV': typeof window !== 'undefined' ? window.ENV : 'N/A'
    });
    return windowMocks || processMocks || false;
  })();

  /**
   * Google OAuth2 Client ID
   */
  static readonly GOOGLE_CLIENT_ID: string =
    (typeof window !== 'undefined' &&
      window.ENV?.GOOGLE_CLIENT_ID) ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  /**
   * API base URL (backend endpoint)
   */
  static readonly API_BASE_URL: string =
    (typeof window !== 'undefined' &&
      window.ENV?.CLOUD_FUNCTION_URL) ||
    process.env.API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8080'
      : 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/workoutData');

  /**
   * Google Fitness API scopes
   */
  static readonly SCOPES: string =
    'https://www.googleapis.com/auth/fitness.activity.read ' +
    'https://www.googleapis.com/auth/fitness.body.read';

  /**
   * Log configuration to console (for debugging)
   */
  static logConfig(): void {
    console.log('Frontend Configuration:');
    console.log(`  USE_MOCKS: ${this.USE_MOCKS}`);
    console.log(`  GOOGLE_CLIENT_ID: ${this.GOOGLE_CLIENT_ID}`);
    console.log(`  API_BASE_URL: ${this.API_BASE_URL}`);
    console.log(`  SCOPES: ${this.SCOPES}`);
  }
}
