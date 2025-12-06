/**
 * Get Workouts Use Case
 * Business logic for fetching user workouts
 */

import { IWorkoutRepository } from '@/backend/services/interfaces/IWorkoutRepository';
import { IAuthService } from '@/backend/services/interfaces/IAuthService';
import { Workout } from '@/backend/domain/models/Workout';

/**
 * Use case for retrieving user workouts
 * Orchestrates authentication validation and workout retrieval
 */
export class GetWorkoutsUseCase {
  constructor(
    private readonly repository: IWorkoutRepository,
    private readonly authService: IAuthService
  ) {}

  /**
   * Execute the use case
   * @param userId - User identifier
   * @param accessToken - OAuth2 access token
   * @returns Promise resolving to sorted array of workouts
   * @throws Error if token is invalid
   */
  async execute(userId: string, accessToken: string): Promise<Workout[]> {
    // Validate access token
    const isValid = await this.authService.validateToken(accessToken);
    if (!isValid) {
      throw new Error('Invalid or expired access token');
    }

    // Calculate date range (last 300 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 300);

    // Fetch workouts from repository
    const workouts = await this.repository.findByDateRange(
      userId,
      startDate,
      endDate,
      accessToken
    );

    // Sort by start time (most recent first)
    workouts.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeB - timeA;
    });

    return workouts;
  }
}
