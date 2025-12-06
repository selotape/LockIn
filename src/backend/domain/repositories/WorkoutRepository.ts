/**
 * Workout repository implementation
 * Delegates to IFitnessService for data access
 */

import { IWorkoutRepository } from '@/backend/services/interfaces/IWorkoutRepository';
import { IFitnessService } from '@/backend/services/interfaces/IFitnessService';
import { Workout } from '@/backend/domain/models/Workout';

/**
 * Repository for workout data access
 * Implements repository pattern by delegating to fitness service
 */
export class WorkoutRepository implements IWorkoutRepository {
  constructor(private readonly fitnessService: IFitnessService) {}

  /**
   * Find workouts within a date range
   * @param userId - User identifier (for future extensibility)
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to array of workouts
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    accessToken: string
  ): Promise<Workout[]> {
    // Delegate to fitness service
    return await this.fitnessService.getWorkouts(
      accessToken,
      startDate,
      endDate
    );
  }
}
