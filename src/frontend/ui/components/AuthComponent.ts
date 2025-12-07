/**
 * Authentication Component
 * Handles sign-in/sign-out UI
 */

import { IAuthService } from '@/frontend/services/interfaces/IAuthService';
import { IStorageService } from '@/frontend/services/interfaces/IStorageService';
import { GoogleAuthService } from '@/frontend/services/auth/GoogleAuthService';

/**
 * Authentication component for managing sign-in/sign-out UI
 */
export class AuthComponent {
  private signInDiv: HTMLElement;
  private signOutButton: HTMLElement;
  private authService: IAuthService;
  private storageService: IStorageService;
  private onSignIn?: () => void;
  private onSignOut?: () => void;

  constructor(
    authService: IAuthService,
    storageService: IStorageService,
    signInDivId: string = 'signInDiv',
    signOutButtonId: string = 'signOutButton'
  ) {
    const signInDiv = document.getElementById(signInDivId);
    const signOutButton = document.getElementById(signOutButtonId);

    if (!signInDiv || !signOutButton) {
      throw new Error('Auth elements not found');
    }

    this.signInDiv = signInDiv;
    this.signOutButton = signOutButton;
    this.authService = authService;
    this.storageService = storageService;

    // Set up sign-out button click handler
    this.signOutButton.onclick = () => this.handleSignOut();
  }

  /**
   * Initialize auth component
   */
  async initialize(): Promise<void> {
    await this.authService.initialize();

    // Render sign-in button if using GoogleAuthService
    if (this.authService instanceof GoogleAuthService) {
      (this.authService as GoogleAuthService).renderButton(this.signInDiv);
    }
  }

  /**
   * Show signed-in state
   */
  showSignedInState(): void {
    this.signInDiv.style.display = 'none';
    this.signOutButton.style.display = 'block';
  }

  /**
   * Show signed-out state
   */
  showSignedOutState(): void {
    this.signInDiv.style.display = 'block';
    this.signOutButton.style.display = 'none';
  }

  /**
   * Handle sign-out
   */
  private handleSignOut(): void {
    // Call auth service sign out
    this.authService.signOut();

    // Clear stored token
    this.storageService.removeItem('google_access_token');

    // Update UI
    this.showSignedOutState();

    // Call callback if provided
    if (this.onSignOut) {
      this.onSignOut();
    }
  }

  /**
   * Set sign-in callback
   */
  setOnSignIn(callback: () => void): void {
    this.onSignIn = callback;
  }

  /**
   * Set sign-out callback
   */
  setOnSignOut(callback: () => void): void {
    this.onSignOut = callback;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  /**
   * Check if signed in
   */
  isSignedIn(): boolean {
    return this.authService.isSignedIn();
  }
}
