/**
 * Application State Management
 * Simple state management for the app
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Application state enum
 */
export enum AppStateEnum {
  SIGNED_OUT = 'SIGNED_OUT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
  NO_DATA = 'NO_DATA',
}

/**
 * State change event
 */
export interface StateChangeEvent {
  oldState: AppStateEnum;
  newState: AppStateEnum;
}

/**
 * State change listener
 */
export type StateChangeListener = (event: StateChangeEvent) => void;

/**
 * Application state manager
 * Manages app state and notifies listeners of changes
 */
export class AppState {
  private state: AppStateEnum = AppStateEnum.SIGNED_OUT;
  private workouts: Workout[] = [];
  private error: string = '';
  private listeners: StateChangeListener[] = [];

  /**
   * Get current state
   */
  getState(): AppStateEnum {
    return this.state;
  }

  /**
   * Set state and notify listeners
   */
  setState(newState: AppStateEnum): void {
    const oldState = this.state;
    this.state = newState;

    // Notify listeners
    this.notifyListeners({ oldState, newState });
  }

  /**
   * Get workouts
   */
  getWorkouts(): Workout[] {
    return this.workouts;
  }

  /**
   * Set workouts
   */
  setWorkouts(workouts: Workout[]): void {
    this.workouts = workouts;
  }

  /**
   * Get error message
   */
  getError(): string {
    return this.error;
  }

  /**
   * Set error message
   */
  setError(error: string): void {
    this.error = error;
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error = '';
  }

  /**
   * Add state change listener
   */
  addListener(listener: StateChangeListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove state change listener
   */
  removeListener(listener: StateChangeListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(event: StateChangeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Check if signed in
   */
  isSignedIn(): boolean {
    return this.state !== AppStateEnum.SIGNED_OUT;
  }

  /**
   * Check if loading
   */
  isLoading(): boolean {
    return this.state === AppStateEnum.LOADING;
  }

  /**
   * Check if has error
   */
  hasError(): boolean {
    return this.state === AppStateEnum.ERROR;
  }

  /**
   * Check if has data
   */
  hasData(): boolean {
    return this.state === AppStateEnum.LOADED && this.workouts.length > 0;
  }

  /**
   * Reset state to signed out
   */
  reset(): void {
    this.setState(AppStateEnum.SIGNED_OUT);
    this.workouts = [];
    this.error = '';
  }
}
