/**
 * Mock API Client
 * Mock implementation for local development without backend
 */

import { IApiClient } from '../interfaces/IApiClient';
import { WorkoutsResponse } from '@/shared/types/ApiResponse.types';
import { FRONTEND_MOCK_WORKOUTS } from '@/frontend/data/mock-workouts.data';

/**
 * Mock API client for testing without backend
 * Returns static mock workout data
 */
export class MockApiClient implements IApiClient {
  /**
   * Get mock workouts
   * @param accessToken - Access token (ignored in mock)
   * @returns Promise resolving to mock workouts
   */
  async getWorkouts(accessToken: string): Promise<WorkoutsResponse> {
    console.log('[MOCK API] Fetching workouts...');

    // Simulate network delay
    await this.delay(800);

    // Return mock data
    const workouts = [...FRONTEND_MOCK_WORKOUTS]; // Copy to avoid mutations

    console.log(`[MOCK API] Returning ${workouts.length} mock workouts`);

    return {
      workouts,
      totalCount: workouts.length,
    };
  }

  /**
   * Simulate async delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
