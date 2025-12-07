/**
 * API Client
 * Real implementation using fetch for HTTP requests
 */

import { IApiClient } from '../interfaces/IApiClient';
import { WorkoutsResponse } from '@/shared/types/ApiResponse.types';
import { API_ENDPOINTS } from '@/shared/constants/api-endpoints';

/**
 * Real API client for backend communication
 * Makes HTTP requests using fetch API
 */
export class ApiClient implements IApiClient {
  constructor(private readonly baseUrl: string) {}

  /**
   * Get workouts from backend
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to workouts response
   * @throws Error if request fails or token is invalid
   */
  async getWorkouts(accessToken: string): Promise<WorkoutsResponse> {
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const url = `${this.baseUrl}${API_ENDPOINTS.WORKOUTS}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle HTTP errors
      if (!response.ok) {
        // Handle expired/invalid token (401 Unauthorized)
        if (response.status === 401) {
          throw new Error('EXPIRED_TOKEN');
        }

        // Try to parse error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Failed to parse error JSON, use default message
        }

        throw new Error(errorMessage);
      }

      // Parse response
      const data = await response.json();

      // Validate response format
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      if (!Array.isArray(data.workouts)) {
        throw new Error('Invalid response format: workouts must be an array');
      }

      return {
        workouts: data.workouts,
        totalCount: data.totalCount || data.workouts.length,
      };
    } catch (error) {
      // Re-throw with more context
      if (error instanceof Error) {
        console.error('API request failed:', error.message);
        throw error;
      }

      // Network error or other unexpected error
      console.error('Unexpected error during API request:', error);
      throw new Error('Failed to fetch workouts: Network error');
    }
  }
}
