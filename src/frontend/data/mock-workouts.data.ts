/**
 * Frontend mock workout data
 * Simple mock data for frontend testing without backend
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Generate a mock workout
 */
function createMockWorkout(
  id: string,
  name: string,
  activityType: number,
  daysAgo: number,
  durationMinutes: number,
  description?: string
): Workout {
  const endTime = new Date();
  endTime.setDate(endTime.getDate() - daysAgo);
  endTime.setHours(Math.floor(Math.random() * 12) + 7, Math.floor(Math.random() * 60), 0, 0);

  const startTime = new Date(endTime);
  startTime.setMinutes(startTime.getMinutes() - durationMinutes);

  return {
    id: `mock-workout-${id}`,
    name,
    activityType,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: durationMinutes * 60 * 1000,
    description: description || `Mock ${name.toLowerCase()} session`,
    application: 'Mock Fitness App',
  };
}

/**
 * Mock workout data (30 workouts spanning 300 days)
 */
export const FRONTEND_MOCK_WORKOUTS: Workout[] = [
  // Recent workouts (last week)
  createMockWorkout('1', 'Running', 8, 1, 45, 'Morning run in the park'),
  createMockWorkout('2', 'Yoga', 102, 2, 60, 'Evening yoga session'),
  createMockWorkout('3', 'Biking', 1, 3, 90, 'Long bike ride'),
  createMockWorkout('4', 'Swimming', 84, 4, 30, 'Pool swimming'),
  createMockWorkout('5', 'Strength training', 82, 5, 45, 'Strength training at gym'),
  createMockWorkout('6', 'Running', 8, 6, 50, 'Interval training run'),
  createMockWorkout('7', 'Walking', 7, 7, 35, 'Walk with dog'),

  // Last two weeks
  createMockWorkout('8', 'Tennis', 89, 10, 60, 'Tennis match'),
  createMockWorkout('9', 'Yoga', 102, 12, 50, 'Yoga flow class'),
  createMockWorkout('10', 'Mountain biking', 15, 14, 120, 'Mountain biking trail'),
  createMockWorkout('11', 'Swimming', 84, 15, 45, 'Open water swim'),
  createMockWorkout('12', 'Running', 8, 17, 40, 'Easy recovery run'),

  // Last month
  createMockWorkout('13', 'Hiking', 35, 21, 180, 'Hiking in the mountains'),
  createMockWorkout('14', 'Elliptical', 25, 24, 40, 'Elliptical workout'),
  createMockWorkout('15', 'Strength training', 82, 26, 50, 'Upper body strength'),
  createMockWorkout('16', 'Biking', 1, 28, 75, 'City bike commute'),
  createMockWorkout('17', 'Yoga', 102, 30, 45, 'Hot yoga'),

  // Two months ago
  createMockWorkout('18', 'Running', 8, 45, 60, '10K race'),
  createMockWorkout('19', 'Walking', 7, 50, 90, 'Long nature walk'),
  createMockWorkout('20', 'Swimming', 84, 52, 50, 'Swimming laps'),
  createMockWorkout('21', 'Circuit training', 22, 55, 45, 'Circuit training'),
  createMockWorkout('22', 'Biking', 1, 60, 100, 'Weekend bike ride'),

  // Three months ago
  createMockWorkout('23', 'Running', 8, 90, 55, 'Trail running'),
  createMockWorkout('24', 'Yoga', 102, 95, 60, 'Restorative yoga'),
  createMockWorkout('25', 'Strength training', 82, 100, 60, 'Full body workout'),
  createMockWorkout('26', 'Swimming', 84, 105, 40, 'Morning swim'),

  // Older workouts (spread across remaining days)
  createMockWorkout('27', 'Running', 8, 150, 50, 'Long distance run'),
  createMockWorkout('28', 'Biking', 1, 200, 90, 'Bike touring'),
  createMockWorkout('29', 'Hiking', 35, 250, 240, 'Day hike'),
  createMockWorkout('30', 'Yoga', 102, 290, 45, 'Yoga practice'),
];
