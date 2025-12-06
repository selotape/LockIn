/**
 * Mock workout data for local development
 * Realistic fake workout data spanning 300 days
 */

import { Workout } from '@/shared/types/Workout.types';
import { getActivityName } from '@/shared/constants/activity-types';

/**
 * Generate a mock workout
 */
function createMockWorkout(
  id: string,
  activityType: number,
  daysAgo: number,
  durationMinutes: number,
  description?: string
): Workout {
  const endTime = new Date();
  endTime.setDate(endTime.getDate() - daysAgo);
  endTime.setHours(Math.floor(Math.random() * 12) + 7, Math.floor(Math.random() * 60), 0, 0); // Random time between 7am-7pm

  const startTime = new Date(endTime);
  startTime.setMinutes(startTime.getMinutes() - durationMinutes);

  const activityName = getActivityName(activityType);

  return {
    id: `mock-workout-${id}`,
    name: activityName,
    activityType,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: durationMinutes * 60 * 1000, // Convert to milliseconds
    description: description || `Mock ${activityName.toLowerCase()} session`,
    application: 'Mock Fitness App',
  };
}

/**
 * Mock workout data (30 workouts spanning 300 days)
 */
export const MOCK_WORKOUTS: Workout[] = [
  // Recent workouts (last week)
  createMockWorkout('1', 8, 1, 45, 'Morning run in the park'), // Running
  createMockWorkout('2', 102, 2, 60, 'Evening yoga session'), // Yoga
  createMockWorkout('3', 1, 3, 90, 'Long bike ride'), // Biking
  createMockWorkout('4', 84, 4, 30, 'Pool swimming'), // Swimming
  createMockWorkout('5', 82, 5, 45, 'Strength training at gym'), // Strength training
  createMockWorkout('6', 8, 6, 50, 'Interval training run'), // Running
  createMockWorkout('7', 7, 7, 35, 'Walk with dog'), // Walking

  // Last two weeks
  createMockWorkout('8', 89, 10, 60, 'Tennis match'), // Tennis
  createMockWorkout('9', 102, 12, 50, 'Yoga flow class'), // Yoga
  createMockWorkout('10', 15, 14, 120, 'Mountain biking trail'), // Mountain biking
  createMockWorkout('11', 84, 15, 45, 'Open water swim'), // Swimming
  createMockWorkout('12', 8, 17, 40, 'Easy recovery run'), // Running

  // Last month
  createMockWorkout('13', 35, 21, 180, 'Hiking in the mountains'), // Hiking
  createMockWorkout('14', 25, 24, 40, 'Elliptical workout'), // Elliptical
  createMockWorkout('15', 82, 26, 50, 'Upper body strength'), // Strength training
  createMockWorkout('16', 1, 28, 75, 'City bike commute'), // Biking
  createMockWorkout('17', 102, 30, 45, 'Hot yoga'), // Yoga

  // Two months ago
  createMockWorkout('18', 8, 45, 60, '10K race'), // Running
  createMockWorkout('19', 7, 50, 90, 'Long nature walk'), // Walking
  createMockWorkout('20', 84, 52, 50, 'Swimming laps'), // Swimming
  createMockWorkout('21', 22, 55, 45, 'Circuit training'), // Circuit training
  createMockWorkout('22', 1, 60, 100, 'Weekend bike ride'), // Biking

  // Three months ago
  createMockWorkout('23', 8, 90, 55, 'Trail running'), // Running
  createMockWorkout('24', 102, 95, 60, 'Restorative yoga'), // Yoga
  createMockWorkout('25', 82, 100, 60, 'Full body workout'), // Strength training
  createMockWorkout('26', 84, 105, 40, 'Morning swim'), // Swimming

  // Older workouts (spread across remaining days)
  createMockWorkout('27', 8, 150, 50, 'Long distance run'), // Running
  createMockWorkout('28', 1, 200, 90, 'Bike touring'), // Biking
  createMockWorkout('29', 35, 250, 240, 'Day hike'), // Hiking
  createMockWorkout('30', 102, 290, 45, 'Yoga practice'), // Yoga
];

/**
 * Get mock workouts filtered by date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Filtered workouts
 */
export function getMockWorkoutsByDateRange(startDate: Date, endDate: Date): Workout[] {
  return MOCK_WORKOUTS.filter((workout) => {
    const workoutDate = new Date(workout.startTime);
    return workoutDate >= startDate && workoutDate <= endDate;
  });
}

/**
 * Get total count of mock workouts
 */
export const MOCK_WORKOUT_COUNT = MOCK_WORKOUTS.length;

/**
 * Get mock workout by ID
 * @param id - Workout ID
 * @returns Workout or undefined
 */
export function getMockWorkoutById(id: string): Workout | undefined {
  return MOCK_WORKOUTS.find((workout) => workout.id === id);
}
