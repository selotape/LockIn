/**
 * Tests for MockFitnessService
 */

import { MockFitnessService } from '@/backend/services/fitness/MockFitnessService';
import { MOCK_WORKOUTS } from '@/backend/infrastructure/data/mock-workouts.data';

describe('MockFitnessService', () => {
  let service: MockFitnessService;

  beforeEach(() => {
    service = new MockFitnessService();
  });

  describe('getWorkouts', () => {
    it('should return mock workouts', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-12-31');
      const accessToken = 'mock-token';

      const workouts = await service.getWorkouts(
        accessToken,
        startDate,
        endDate
      );

      expect(Array.isArray(workouts)).toBe(true);
      expect(workouts.length).toBeGreaterThan(0);
    });

    it('should filter workouts by date range', async () => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      const endDate = now;
      const accessToken = 'mock-token';

      const workouts = await service.getWorkouts(
        accessToken,
        startDate,
        endDate
      );

      // All returned workouts should be within the date range
      workouts.forEach((workout) => {
        const workoutDate = new Date(workout.startTime);
        expect(workoutDate.getTime()).toBeGreaterThanOrEqual(
          startDate.getTime()
        );
        expect(workoutDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should return empty array if no workouts in range', async () => {
      // Date range in the far future
      const startDate = new Date('2030-01-01');
      const endDate = new Date('2030-12-31');
      const accessToken = 'mock-token';

      const workouts = await service.getWorkouts(
        accessToken,
        startDate,
        endDate
      );

      expect(workouts).toEqual([]);
    });

    it('should return workouts with correct structure', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-12-31');
      const accessToken = 'mock-token';

      const workouts = await service.getWorkouts(
        accessToken,
        startDate,
        endDate
      );

      if (workouts.length > 0) {
        const workout = workouts[0];
        expect(workout).toHaveProperty('id');
        expect(workout).toHaveProperty('name');
        expect(workout).toHaveProperty('activityType');
        expect(workout).toHaveProperty('startTime');
        expect(workout).toHaveProperty('endTime');
        expect(workout).toHaveProperty('duration');
        expect(workout).toHaveProperty('application');
        expect(typeof workout.id).toBe('string');
        expect(typeof workout.name).toBe('string');
        expect(typeof workout.activityType).toBe('number');
      }
    });
  });

  describe('getActivityName', () => {
    it('should return correct activity names', () => {
      expect(service.getActivityName(8)).toBe('Running');
      expect(service.getActivityName(102)).toBe('Yoga');
      expect(service.getActivityName(1)).toBe('Biking');
    });

    it('should return fallback for unknown activity types', () => {
      expect(service.getActivityName(999)).toBe('Activity 999');
    });
  });
});
