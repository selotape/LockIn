/**
 * Workout Grouper
 * Pure functions for grouping workouts by date
 */

import { Workout, WorkoutGroup } from '@/shared/types/Workout.types';

/**
 * Group workouts by various criteria
 */
export class WorkoutGrouper {
  /**
   * Group workouts by date (date string as key)
   * @param workouts - Array of workouts
   * @returns Map of date string to workout array
   */
  static groupByDate(workouts: Workout[]): Record<string, Workout[]> {
    const groups: Record<string, Workout[]> = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.startTime).toDateString();

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(workout);
    });

    return groups;
  }

  /**
   * Group workouts by date and return as array with formatted dates
   * Useful for timeline rendering
   * @param workouts - Array of workouts
   * @returns Array of workout groups with date and workouts
   */
  static groupByDateAsArray(workouts: Workout[]): WorkoutGroup[] {
    const grouped = this.groupByDate(workouts);

    return Object.entries(grouped).map(([date, workouts]) => ({
      date,
      workouts,
      count: workouts.length,
    }));
  }

  /**
   * Group workouts by activity type
   * @param workouts - Array of workouts
   * @returns Map of activity type to workout array
   */
  static groupByActivityType(
    workouts: Workout[]
  ): Record<number, Workout[]> {
    const groups: Record<number, Workout[]> = {};

    workouts.forEach((workout) => {
      if (!groups[workout.activityType]) {
        groups[workout.activityType] = [];
      }

      groups[workout.activityType].push(workout);
    });

    return groups;
  }

  /**
   * Group workouts by activity name
   * @param workouts - Array of workouts
   * @returns Map of activity name to workout array
   */
  static groupByActivityName(
    workouts: Workout[]
  ): Record<string, Workout[]> {
    const groups: Record<string, Workout[]> = {};

    workouts.forEach((workout) => {
      const activityName = workout.name;

      if (!groups[activityName]) {
        groups[activityName] = [];
      }

      groups[activityName].push(workout);
    });

    return groups;
  }
}
