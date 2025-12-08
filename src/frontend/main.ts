/**
 * Main Entry Point
 * Initializes and coordinates the app
 */

import { AppConfig } from './config/app.config';
import { ServiceFactory } from './services/ServiceFactory';
import { AppState, AppStateEnum } from './ui/state/AppState';
import { AuthComponent } from './ui/components/AuthComponent';
import { LoadingComponent } from './ui/components/LoadingComponent';
import { StatsComponent } from './ui/components/StatsComponent';
import { TimelineComponent } from './ui/components/TimelineComponent';
import { TimelineRenderer } from './ui/renderers/TimelineRenderer';

/**
 * Main application class
 */
class App {
  private appState: AppState;
  private authComponent: AuthComponent;
  private loadingComponent: LoadingComponent;
  private statsComponent: StatsComponent;
  private timelineComponent: TimelineComponent;

  // Services
  private authService = ServiceFactory.getAuthService();
  private apiClient = ServiceFactory.getApiClient();
  private storageService = ServiceFactory.getStorageService();

  constructor() {
    // Initialize state
    this.appState = new AppState();

    // Initialize components
    this.authComponent = new AuthComponent(
      this.authService,
      this.storageService
    );
    this.loadingComponent = new LoadingComponent();
    this.statsComponent = new StatsComponent();
    this.timelineComponent = new TimelineComponent();

    // Set up state listener
    this.appState.addListener((event) => this.handleStateChange(event));

    // Set up component callbacks
    this.authComponent.setOnSignIn(() => this.handleSignIn());
    this.authComponent.setOnSignOut(() => this.handleSignOut());
    this.timelineComponent.setRetryHandler(() => this.loadWorkouts());
  }

  /**
   * Initialize the app
   */
  async initialize(): Promise<void> {
    console.log('Initializing LockIn Workout Timeline...');

    // Log config
    AppConfig.logConfig();
    ServiceFactory.logConfiguration();

    // Initialize auth service
    await this.authComponent.initialize();

    // In mock mode, add a mock sign-in button
    if (AppConfig.USE_MOCKS) {
      this.setupMockSignInButton();
    }

    // Check for saved token
    const savedToken = this.storageService.getItem('google_access_token');
    if (savedToken) {
      console.log('Found saved token, loading workouts...');
      await this.loadWorkouts();
    }

    console.log('App initialized');
  }

  /**
   * Set up mock sign-in button
   */
  private setupMockSignInButton(): void {
    const signInDiv = document.getElementById('signInDiv');
    if (signInDiv) {
      signInDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <p style="margin-bottom: 10px; color: #666;">Running in MOCK mode</p>
          <button id="mock-signin-btn" style="
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          ">
            Load Mock Workouts
          </button>
        </div>
      `;

      const mockSignInBtn = document.getElementById('mock-signin-btn');
      if (mockSignInBtn) {
        mockSignInBtn.onclick = () => this.handleSignIn();
      }
    }
  }

  /**
   * Handle state changes
   */
  private handleStateChange(event: any): void {
    const { newState } = event;

    console.log(`State changed to: ${newState}`);

    // Update UI based on state
    switch (newState) {
      case AppStateEnum.SIGNED_OUT:
        this.showSignedOutState();
        break;

      case AppStateEnum.LOADING:
        this.showLoadingState();
        break;

      case AppStateEnum.LOADED:
        this.showLoadedState();
        break;

      case AppStateEnum.ERROR:
        this.showErrorState();
        break;

      case AppStateEnum.NO_DATA:
        this.showNoDataState();
        break;
    }
  }

  /**
   * Show signed-out state
   */
  private showSignedOutState(): void {
    this.authComponent.showSignedOutState();
    this.loadingComponent.hide();
    this.timelineComponent.hideAll();
    this.statsComponent.clear();
  }

  /**
   * Show loading state
   */
  private showLoadingState(): void {
    this.loadingComponent.show();
    this.timelineComponent.hideAll();
  }

  /**
   * Show loaded state
   */
  private showLoadedState(): void {
    this.loadingComponent.hide();
    this.authComponent.showSignedInState();

    const workouts = this.appState.getWorkouts();

    // Render stats
    this.statsComponent.render(workouts);

    // Render timeline
    const timelineContent = TimelineRenderer.render(workouts);
    this.timelineComponent.render(timelineContent);
  }

  /**
   * Show error state
   */
  private showErrorState(): void {
    this.loadingComponent.hide();

    const error = this.appState.getError();
    const showRetryButton = !error.includes('expired');

    this.timelineComponent.showError(error, showRetryButton);

    // If token expired, show signed-out state
    if (error.includes('expired')) {
      this.handleExpiredToken();
    }
  }

  /**
   * Show no data state
   */
  private showNoDataState(): void {
    this.loadingComponent.hide();
    this.authComponent.showSignedInState();
    this.timelineComponent.showNoData();
    this.statsComponent.clear();
  }

  /**
   * Handle sign-in
   */
  private async handleSignIn(): Promise<void> {
    try {
      console.log('Signing in...');

      // Sign in via auth service
      const credentials = await this.authService.signIn();

      // Save token
      this.storageService.setItem(
        'google_access_token',
        credentials.accessToken
      );

      // Load workouts
      await this.loadWorkouts();
    } catch (error) {
      console.error('Sign-in failed:', error);
      this.appState.setError('Sign-in failed. Please try again.');
      this.appState.setState(AppStateEnum.ERROR);
    }
  }

  /**
   * Handle sign-out
   */
  private handleSignOut(): void {
    console.log('Signing out...');

    // Reset state
    this.appState.reset();

    // Clear stored token
    this.storageService.removeItem('google_access_token');
  }

  /**
   * Handle expired token
   */
  private handleExpiredToken(): void {
    console.log('Token expired');

    // Clear stored token
    this.storageService.removeItem('google_access_token');

    // Show signed-out state
    this.authComponent.showSignedOutState();

    // Show error message
    this.timelineComponent.showError(
      'Your session has expired. Please sign in again to view your workout data.',
      false
    );
  }

  /**
   * Load workouts
   */
  private async loadWorkouts(): Promise<void> {
    try {
      // Set loading state
      this.appState.setState(AppStateEnum.LOADING);

      // Get access token
      const accessToken = this.authComponent.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Fetch workouts from API
      const response = await this.apiClient.getWorkouts(accessToken);

      // Update state with workouts
      this.appState.setWorkouts(response.workouts);

      // Determine state based on data
      if (response.workouts.length > 0) {
        this.appState.setState(AppStateEnum.LOADED);
      } else {
        this.appState.setState(AppStateEnum.NO_DATA);
      }
    } catch (error: any) {
      console.error('Failed to load workouts:', error);

      // Check if token expired
      if (error.message === 'EXPIRED_TOKEN') {
        this.appState.setError('Your session has expired.');
      } else {
        this.appState.setError(
          `Failed to load workout data: ${error.message}`
        );
      }

      this.appState.setState(AppStateEnum.ERROR);
    }
  }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  await app.initialize();
});
