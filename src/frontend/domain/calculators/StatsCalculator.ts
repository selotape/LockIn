/**
 * Stats Calculator
 * Pure functions for calculating workout statistics
 */

import { Workout, WorkoutStats } from '@/shared/types/Workout.types';

/**
 * Calculate workout statistics from a list of workouts
 */
export class StatsCalculator {
  /**
   * Calculate comprehensive statistics from workouts
   * @param workouts - Array of workouts
   * @returns Workout statistics
   */
  static calculateStats(workouts: Workout[]): WorkoutStats {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalTimeHours: 0,
        mostActiveDay: '-',
        workoutsByDay: {},
      };
    }

    // Calculate total workouts
    const totalWorkouts = workouts.length;

    // Calculate total time in hours
    const totalTimeMs = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const totalTimeHours = Math.round((totalTimeMs / (1000 * 60 * 60)) * 10) / 10;

    // Count workouts by day of week
    const workoutsByDay: Record<string, number> = {};
    workouts.forEach((workout) => {
      const date = new Date(workout.startTime);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      workoutsByDay[dayName] = (workoutsByDay[dayName] || 0) + 1;
    });

    // Find most active day
    const mostActiveDay =
      Object.keys(workoutsByDay).reduce((mostActive, day) => {
        return workoutsByDay[day] > workoutsByDay[mostActive]
          ? day
          : mostActive;
      }, Object.keys(workoutsByDay)[0]) || '-';

    return {
      totalWorkouts,
      totalTimeHours,
      mostActiveDay,
      workoutsByDay,
    };
  }

  /**
   * Calculate total workout duration in milliseconds
   * @param workouts - Array of workouts
   * @returns Total duration in milliseconds
   */
  static calculateTotalDuration(workouts: Workout[]): number {
    return workouts.reduce((sum, workout) => sum + workout.duration, 0);
  }

  /**
   * Calculate total workout duration in hours
   * @param workouts - Array of workouts
   * @returns Total duration in hours (rounded to 1 decimal)
   */
  static calculateTotalHours(workouts: Workout[]): number {
    const totalMs = this.calculateTotalDuration(workouts);
    return Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10;
  }

  /**
   * Count workouts by day of week
   * @param workouts - Array of workouts
   * @returns Map of day name to count
   */
  static countByDayOfWeek(
    workouts: Workout[]
  ): Record<string, number> {
    const dayCount: Record<string, number> = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.startTime);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });

    return dayCount;
  }

  /**
   * Find the most active day of the week
   * @param workouts - Array of workouts
   * @returns Day name (e.g., "Monday") or "-" if no workouts
   */
  static findMostActiveDay(workouts: Workout[]): string {
    if (workouts.length === 0) {
      return '-';
    }

    const dayCount = this.countByDayOfWeek(workouts);

    return Object.keys(dayCount).reduce((mostActive, day) => {
      return dayCount[day] > dayCount[mostActive] ? day : mostActive;
    }, Object.keys(dayCount)[0]);
  }
}
