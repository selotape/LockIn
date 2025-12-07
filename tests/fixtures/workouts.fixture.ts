/**
 * Workout Test Fixtures
 * Shared test data for frontend tests
 */

import { Workout } from '@/shared/types/Workout.types';

/**
 * Create a test workout with default values
 */
function createTestWorkout(overrides: Partial<Workout>): Workout {
  return {
    id: 'test-workout-1',
    name: 'Running',
    activityType: 8,
    startTime: new Date('2025-01-01T10:00:00Z').toISOString(),
    endTime: new Date('2025-01-01T11:00:00Z').toISOString(),
    duration: 3600000, // 1 hour in milliseconds
    description: 'Test workout',
    application: 'Test App',
    ...overrides,
  };
}

/**
 * Fixture: Single workout
 */
export const SINGLE_WORKOUT: Workout = createTestWorkout({
  id: 'workout-1',
  name: 'Running',
  activityType: 8,
  startTime: new Date('2025-01-01T10:00:00Z').toISOString(),
  endTime: new Date('2025-01-01T11:00:00Z').toISOString(),
  duration: 3600000, // 1 hour
  description: 'Morning run',
});

/**
 * Fixture: Multiple workouts on different days
 */
export const MULTIPLE_WORKOUTS: Workout[] = [
  createTestWorkout({
    id: 'workout-1',
    name: 'Running',
    activityType: 8,
    startTime: new Date('2025-01-01T10:00:00Z').toISOString(),
    endTime: new Date('2025-01-01T11:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
    description: 'Morning run',
  }),
  createTestWorkout({
    id: 'workout-2',
    name: 'Yoga',
    activityType: 102,
    startTime: new Date('2025-01-02T09:00:00Z').toISOString(),
    endTime: new Date('2025-01-02T10:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
    description: 'Yoga session',
  }),
  createTestWorkout({
    id: 'workout-3',
    name: 'Swimming',
    activityType: 84,
    startTime: new Date('2025-01-03T15:00:00Z').toISOString(),
    endTime: new Date('2025-01-03T16:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
    description: 'Pool swimming',
  }),
];

/**
 * Fixture: Multiple workouts on the same day
 */
export const SAME_DAY_WORKOUTS: Workout[] = [
  createTestWorkout({
    id: 'workout-1',
    name: 'Running',
    activityType: 8,
    startTime: new Date('2025-01-01T07:00:00Z').toISOString(),
    endTime: new Date('2025-01-01T08:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
    description: 'Morning run',
  }),
  createTestWorkout({
    id: 'workout-2',
    name: 'Weightlifting',
    activityType: 82,
    startTime: new Date('2025-01-01T18:00:00Z').toISOString(),
    endTime: new Date('2025-01-01T19:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
    description: 'Evening gym',
  }),
];

/**
 * Fixture: Workouts with varying durations
 */
export const VARIED_DURATION_WORKOUTS: Workout[] = [
  createTestWorkout({
    id: 'workout-1',
    name: 'Running',
    activityType: 8,
    startTime: new Date('2025-01-01T10:00:00Z').toISOString(),
    endTime: new Date('2025-01-01T10:30:00Z').toISOString(),
    duration: 1800000, // 30 minutes
  }),
  createTestWorkout({
    id: 'workout-2',
    name: 'Cycling',
    activityType: 1,
    startTime: new Date('2025-01-02T10:00:00Z').toISOString(),
    endTime: new Date('2025-01-02T12:00:00Z').toISOString(),
    duration: 7200000, // 2 hours
  }),
  createTestWorkout({
    id: 'workout-3',
    name: 'Yoga',
    activityType: 102,
    startTime: new Date('2025-01-03T10:00:00Z').toISOString(),
    endTime: new Date('2025-01-03T10:45:00Z').toISOString(),
    duration: 2700000, // 45 minutes
  }),
];

/**
 * Fixture: Workouts grouped by activity type
 */
export const GROUPED_BY_ACTIVITY_WORKOUTS: Workout[] = [
  createTestWorkout({
    id: 'workout-1',
    name: 'Running',
    activityType: 8,
    duration: 3600000, // 1 hour
  }),
  createTestWorkout({
    id: 'workout-2',
    name: 'Running',
    activityType: 8,
    duration: 3600000, // 1 hour
  }),
  createTestWorkout({
    id: 'workout-3',
    name: 'Swimming',
    activityType: 84,
    duration: 3600000, // 1 hour
  }),
];

/**
 * Fixture: Workouts for stats testing
 * 5 workouts: 3 on Monday, 1 on Tuesday, 1 on Wednesday
 * Total: 7.5 hours
 */
export const STATS_TEST_WORKOUTS: Workout[] = [
  // Monday workouts
  createTestWorkout({
    id: 'workout-1',
    name: 'Running',
    activityType: 8,
    startTime: new Date('2025-01-06T07:00:00Z').toISOString(), // Monday
    endTime: new Date('2025-01-06T08:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
  }),
  createTestWorkout({
    id: 'workout-2',
    name: 'Yoga',
    activityType: 102,
    startTime: new Date('2025-01-06T12:00:00Z').toISOString(), // Monday
    endTime: new Date('2025-01-06T13:00:00Z').toISOString(),
    duration: 3600000, // 1 hour
  }),
  createTestWorkout({
    id: 'workout-3',
    name: 'Swimming',
    activityType: 84,
    startTime: new Date('2025-01-06T18:00:00Z').toISOString(), // Monday
    endTime: new Date('2025-01-06T19:30:00Z').toISOString(),
    duration: 5400000, // 1.5 hours
  }),
  // Tuesday workout
  createTestWorkout({
    id: 'workout-4',
    name: 'Cycling',
    activityType: 1,
    startTime: new Date('2025-01-07T10:00:00Z').toISOString(), // Tuesday
    endTime: new Date('2025-01-07T12:00:00Z').toISOString(),
    duration: 7200000, // 2 hours
  }),
  // Wednesday workout
  createTestWorkout({
    id: 'workout-5',
    name: 'Hiking',
    activityType: 28,
    startTime: new Date('2025-01-08T09:00:00Z').toISOString(), // Wednesday
    endTime: new Date('2025-01-08T11:00:00Z').toISOString(),
    duration: 7200000, // 2 hours
  }),
];

/**
 * Fixture: Empty workout array
 */
export const EMPTY_WORKOUTS: Workout[] = [];
