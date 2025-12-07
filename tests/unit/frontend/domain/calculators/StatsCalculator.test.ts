/**
 * Tests for StatsCalculator
 */

import { StatsCalculator } from '@/frontend/domain/calculators/StatsCalculator';
import {
  STATS_TEST_WORKOUTS,
  EMPTY_WORKOUTS,
  VARIED_DURATION_WORKOUTS,
} from '../../../../fixtures/workouts.fixture';

describe('StatsCalculator', () => {
  describe('calculateStats', () => {
    it('should calculate correct stats for multiple workouts', () => {
      const stats = StatsCalculator.calculateStats(STATS_TEST_WORKOUTS);

      expect(stats.totalWorkouts).toBe(5);
      expect(stats.totalTimeHours).toBe(7.5); // 1+1+1.5+2+2 = 7.5 hours
      expect(stats.mostActiveDay).toBe('Monday'); // 3 workouts
      expect(stats.workoutsByDay).toEqual({
        Monday: 3,
        Tuesday: 1,
        Wednesday: 1,
      });
    });

    it('should handle empty workout array', () => {
      const stats = StatsCalculator.calculateStats(EMPTY_WORKOUTS);

      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalTimeHours).toBe(0);
      expect(stats.mostActiveDay).toBe('-');
      expect(stats.workoutsByDay).toEqual({});
    });

    it('should calculate correct total duration', () => {
      const stats = StatsCalculator.calculateStats(VARIED_DURATION_WORKOUTS);

      // 30m + 2h + 45m = 3.25 hours, rounds to 3.3
      expect(stats.totalTimeHours).toBeCloseTo(3.3, 1);
    });
  });

  describe('calculateTotalDuration', () => {
    it('should calculate total duration in milliseconds', () => {
      const duration = StatsCalculator.calculateTotalDuration(VARIED_DURATION_WORKOUTS);

      // 1800000 + 7200000 + 2700000 = 11700000 ms
      expect(duration).toBe(11700000);
    });

    it('should return 0 for empty array', () => {
      const duration = StatsCalculator.calculateTotalDuration(EMPTY_WORKOUTS);
      expect(duration).toBe(0);
    });
  });

  describe('calculateTotalHours', () => {
    it('should calculate total hours (rounded)', () => {
      const hours = StatsCalculator.calculateTotalHours(VARIED_DURATION_WORKOUTS);

      // 11700000 ms = 3.25 hours, rounds to 3.3
      expect(hours).toBeCloseTo(3.3, 1);
    });

    it('should return 0 for empty array', () => {
      const hours = StatsCalculator.calculateTotalHours(EMPTY_WORKOUTS);
      expect(hours).toBe(0);
    });
  });

  describe('countByDayOfWeek', () => {
    it('should count workouts by day of week', () => {
      const dayCounts = StatsCalculator.countByDayOfWeek(STATS_TEST_WORKOUTS);

      expect(dayCounts).toEqual({
        Monday: 3,
        Tuesday: 1,
        Wednesday: 1,
      });
    });

    it('should return empty object for empty array', () => {
      const dayCounts = StatsCalculator.countByDayOfWeek(EMPTY_WORKOUTS);
      expect(dayCounts).toEqual({});
    });
  });

  describe('findMostActiveDay', () => {
    it('should find most active day', () => {
      const mostActiveDay = StatsCalculator.findMostActiveDay(STATS_TEST_WORKOUTS);
      expect(mostActiveDay).toBe('Monday');
    });

    it('should return "-" for empty array', () => {
      const mostActiveDay = StatsCalculator.findMostActiveDay(EMPTY_WORKOUTS);
      expect(mostActiveDay).toBe('-');
    });
  });
});
