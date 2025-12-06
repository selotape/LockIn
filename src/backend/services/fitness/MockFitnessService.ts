/**
 * Mock Fitness service implementation
 * Returns fake data for local development without API calls
 */

import { IFitnessService } from '../interfaces/IFitnessService';
import { Workout } from '@/shared/types/Workout.types';
import {
  MOCK_WORKOUTS,
  getMockWorkoutsByDateRange,
} from '@/backend/infrastructure/data/mock-workouts.data';
import { getActivityName } from '@/backend/infrastructure/mappers/activity-type.mapper';

/**
 * Mock fitness service for local development
 * Returns predefined mock workout data
 */
export class MockFitnessService implements IFitnessService {
  /**
   * Get mock workouts filtered by date range
   * @param accessToken - Ignored (no API calls made)
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Promise resolving to filtered mock workouts
   */
  async getWorkouts(
    accessToken: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]> {
    console.log('🎭 MockFitnessService: Returning mock workout data');
    console.log(`  Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Simulate network delay (optional, for more realistic testing)
    await this.simulateDelay(100);

    // Filter workouts by date range
    const filteredWorkouts = getMockWorkoutsByDateRange(startDate, endDate);

    console.log(`  Returning ${filteredWorkouts.length} mock workouts`);

    return filteredWorkouts;
  }

  /**
   * Get activity name from activity type code
   * @param activityType - Google Fitness activity type code
   * @returns Human-readable activity name
   */
  getActivityName(activityType: number): string {
    return getActivityName(activityType);
  }

  /**
   * Simulate network delay for more realistic testing
   * @param ms - Milliseconds to delay
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
