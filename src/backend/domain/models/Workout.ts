/**
 * Workout domain model
 * Re-exports shared Workout type and adds domain methods
 */

export { Workout, WorkoutStats, WorkoutGroup } from '@/shared/types/Workout.types';

/**
 * Domain utility functions for workouts
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Check if a workout occurred on a specific date
 * @param workout - Workout to check
 * @param date - Date to compare against
 * @returns True if workout started on the given date
 */
export function isWorkoutOnDate(workout: Workout, date: Date): boolean {
  const workoutDate = new Date(workout.startTime);
  return (
    workoutDate.getFullYear() === date.getFullYear() &&
    workoutDate.getMonth() === date.getMonth() &&
    workoutDate.getDate() === date.getDate()
  );
}

/**
 * Get workout duration in minutes
 * @param workout - Workout to get duration from
 * @returns Duration in minutes
 */
export function getWorkoutDurationMinutes(workout: Workout): number {
  return Math.round(workout.duration / 60000);
}

/**
 * Get workout duration in hours
 * @param workout - Workout to get duration from
 * @returns Duration in hours (rounded to 2 decimal places)
 */
export function getWorkoutDurationHours(workout: Workout): number {
  return Math.round((workout.duration / 3600000) * 100) / 100;
}

/**
 * Check if a workout is within a date range
 * @param workout - Workout to check
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns True if workout is within range
 */
export function isWorkoutInDateRange(
  workout: Workout,
  startDate: Date,
  endDate: Date
): boolean {
  const workoutDate = new Date(workout.startTime);
  return workoutDate >= startDate && workoutDate <= endDate;
}
