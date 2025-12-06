/**
 * Workout repository interface
 * Abstracts workout data access
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Interface for workout data repositories
 * Implementations: WorkoutRepository (delegates to IFitnessService)
 */
export interface IWorkoutRepository {
  /**
   * Find workouts within a date range for a user
   * @param userId - User identifier (not currently used, but for future extensibility)
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @param accessToken - OAuth2 access token for API authentication
   * @returns Promise resolving to array of workouts
   */
  findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    accessToken: string
  ): Promise<Workout[]>;
}
