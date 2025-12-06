/**
 * Fitness service interface
 * Abstracts access to fitness/workout data
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Interface for fitness data services
 * Implementations: GoogleFitnessService (real), MockFitnessService (mock)
 */
export interface IFitnessService {
  /**
   * Fetch workouts for a user within a date range
   * @param accessToken - OAuth2 access token for API authentication
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Promise resolving to array of workouts
   */
  getWorkouts(
    accessToken: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]>;

  /**
   * Get human-readable name for an activity type code
   * @param activityType - Google Fitness activity type code
   * @returns Activity name
   */
  getActivityName(activityType: number): string;
}
