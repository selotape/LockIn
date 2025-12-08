/**
 * Google Authentication Service
 * Real implementation using Google Identity Services
 */

import { IAuthService } from '../interfaces/IAuthService';
import { AuthCredentials } from '@/shared/types/User.types';
import { AppConfig } from '@/frontend/config/app.config';

/**
 * Google Identity Services types
 */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

/**
 * Real Google authentication service
 * Uses Google Identity Services for sign-in and OAuth2 for API access
 */
export class GoogleAuthService implements IAuthService {
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private tokenClient: any = null;
  private initialized: boolean = false;

  /**
   * Initialize Google Sign-In
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Load Google Sign-In SDK dynamically
    await this.loadGoogleSDK();

    // Wait for Google library to be ready
    await this.waitForGoogleLibrary();

    // Initialize Google Sign-In (for ID token)
    window.google!.accounts.id.initialize({
      client_id: AppConfig.GOOGLE_CLIENT_ID,
      callback: this.handleCredentialResponse.bind(this),
    });

    // Initialize OAuth2 token client (for access token)
    this.tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: AppConfig.GOOGLE_CLIENT_ID,
      scope: AppConfig.SCOPES,
      callback: this.handleTokenResponse.bind(this),
    });

    this.initialized = true;
    console.log('Google Auth initialized');
  }

  /**
   * Sign in the user
   * This will trigger Google Sign-In flow and request access token
   */
  async signIn(): Promise<AuthCredentials> {
    if (!this.initialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      // Store resolve/reject for use in callbacks
      (this as any)._signInResolve = resolve;
      (this as any)._signInReject = reject;

      // Request access token
      // This will trigger OAuth2 consent flow
      this.tokenClient.requestAccessToken();
    });
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    this.accessToken = null;
    this.idToken = null;

    console.log('User signed out');
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Render Google Sign-In button
   * @param container - HTML element to render button in
   */
  renderButton(container: HTMLElement): void {
    if (!this.initialized) {
      console.error('Google Auth not initialized. Call initialize() first.');
      return;
    }

    window.google!.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: 250,
    });
  }

  /**
   * Load Google Sign-In SDK dynamically
   */
  private loadGoogleSDK(): Promise<void> {
    return new Promise((resolve) => {
      // Check if script already exists
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        resolve();
        return;
      }

      // Create and inject script tag
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Sign-In SDK loaded');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Google Sign-In SDK');
        resolve(); // Resolve anyway to avoid hanging
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Wait for Google library to load
   */
  private waitForGoogleLibrary(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google) {
        resolve();
        return;
      }

      // Poll for Google library
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!window.google) {
          console.error('Google library failed to load');
        }
        resolve(); // Resolve anyway to avoid hanging
      }, 10000);
    });
  }

  /**
   * Handle credential response from Google Sign-In
   * This provides the ID token but not the access token
   */
  private handleCredentialResponse(response: any): void {
    if (response.credential) {
      this.idToken = response.credential;
      console.log('Received ID token from Google Sign-In');
      // Note: Still need access token from OAuth2 flow
    }
  }

  /**
   * Handle token response from OAuth2 token client
   * This provides the access token for API calls
   */
  private handleTokenResponse(response: any): void {
    if (response.access_token) {
      this.accessToken = response.access_token;
      console.log('Received access token from OAuth2');

      // Resolve the signIn promise
      if ((this as any)._signInResolve) {
        (this as any)._signInResolve({
          idToken: this.idToken || '',
          accessToken: this.accessToken,
        });
        delete (this as any)._signInResolve;
        delete (this as any)._signInReject;
      }
    } else if (response.error) {
      console.error('OAuth2 error:', response.error);

      // Reject the signIn promise
      if ((this as any)._signInReject) {
        (this as any)._signInReject(
          new Error(`OAuth2 error: ${response.error}`)
        );
        delete (this as any)._signInResolve;
        delete (this as any)._signInReject;
      }
    }
  }
}
