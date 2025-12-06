/**
 * Google Fitness service implementation
 * Real implementation that calls Google Fitness API
 * Extracted from functions/index.js lines 24-59
 */

import { google } from 'googleapis';
import { IFitnessService } from '../interfaces/IFitnessService';
import { Workout } from '@/shared/types/Workout.types';
import { getActivityName } from '@/backend/infrastructure/mappers/activity-type.mapper';

/**
 * Google Fitness API service implementation
 */
export class GoogleFitnessService implements IFitnessService {
  /**
   * Fetch workouts from Google Fitness API
   * @param accessToken - OAuth2 access token
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Promise resolving to array of workouts
   */
  async getWorkouts(
    accessToken: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]> {
    try {
      // Set up OAuth2 client with the access token
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      // Initialize Google Fit API
      const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

      // Convert to nanoseconds (Google Fit API requirement)
      const startTimeNanos = startDate.getTime() * 1000000;
      const endTimeNanos = endDate.getTime() * 1000000;

      // Request workout sessions
      const sessionsResponse = await fitness.users.sessions.list({
        userId: 'me',
        startTime: new Date(startTimeNanos / 1000000).toISOString(),
        endTime: new Date(endTimeNanos / 1000000).toISOString(),
      });

      // Process and format workout data
      const workouts: Workout[] = (sessionsResponse.data.session || []).map(
        (session: any) => {
          const startTimeMillis = parseInt(session.startTimeMillis, 10);
          const endTimeMillis = parseInt(session.endTimeMillis, 10);

          return {
            id: session.id || `session-${startTimeMillis}`,
            name: session.name || this.getActivityName(session.activityType),
            activityType: session.activityType || 113, // 113 = "Other"
            startTime: new Date(startTimeMillis).toISOString(),
            endTime: new Date(endTimeMillis).toISOString(),
            duration: endTimeMillis - startTimeMillis,
            description: session.description || '',
            application: session.application?.detailsUrl || 'Unknown App',
          };
        }
      );

      // Sort by start time (most recent first)
      workouts.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        return timeB - timeA;
      });

      return workouts;
    } catch (error: any) {
      // Log error and rethrow with more context
      console.error('Error fetching workouts from Google Fitness API:', error);

      // Check for common error scenarios
      if (error.code === 401 || error.response?.status === 401) {
        throw new Error('Invalid or expired access token');
      }

      if (error.code === 403 || error.response?.status === 403) {
        throw new Error(
          'Insufficient permissions. Please ensure Fitness API scopes are granted.'
        );
      }

      throw new Error(
        `Failed to fetch workouts: ${error.message || 'Unknown error'}`
      );
    }
  }

  /**
   * Get activity name from activity type code
   * @param activityType - Google Fitness activity type code
   * @returns Human-readable activity name
   */
  getActivityName(activityType: number): string {
    return getActivityName(activityType);
  }
}
