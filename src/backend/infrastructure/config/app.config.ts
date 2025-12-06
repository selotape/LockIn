/**
 * Application configuration
 * Centralized environment-based configuration
 */

/**
 * Application configuration singleton
 */
export class AppConfig {
  /**
   * Whether to use mock implementations instead of real services
   */
  static readonly USE_MOCKS = process.env.USE_MOCKS === 'true';

  /**
   * Server port
   */
  static readonly PORT = parseInt(process.env.PORT || '8080', 10);

  /**
   * Node environment (development, production, test)
   */
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';

  /**
   * Google OAuth2 Client ID
   */
  static readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

  /**
   * Cloud Function URL (for production)
   */
  static readonly CLOUD_FUNCTION_URL = process.env.CLOUD_FUNCTION_URL || '';

  /**
   * Whether the app is running in development mode
   */
  static readonly IS_DEVELOPMENT = this.NODE_ENV === 'development';

  /**
   * Whether the app is running in production mode
   */
  static readonly IS_PRODUCTION = this.NODE_ENV === 'production';

  /**
   * Whether the app is running in test mode
   */
  static readonly IS_TEST = this.NODE_ENV === 'test';

  /**
   * Log current configuration (useful for debugging)
   */
  static logConfig(): void {
    console.log('🔧 Application Configuration:');
    console.log(`  Environment: ${this.NODE_ENV}`);
    console.log(`  Port: ${this.PORT}`);
    console.log(`  Use Mocks: ${this.USE_MOCKS}`);
    console.log(`  Google Client ID: ${this.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Not set'}`);
  }
}
