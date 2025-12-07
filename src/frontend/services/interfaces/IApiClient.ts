/**
 * API Client Interface
 * Abstracts HTTP requests to backend API
 */

import { WorkoutsResponse } from '@/shared/types/ApiResponse.types';

/**
 * Interface for API client services
 * Implementations: ApiClient (real), MockApiClient (mock)
 */
export interface IApiClient {
  /**
   * Get workouts from backend
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to workouts response
   */
  getWorkouts(accessToken: string): Promise<WorkoutsResponse>;
}
