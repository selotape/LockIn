/**
 * Tests for WorkoutGrouper
 */

import { WorkoutGrouper } from '@/frontend/domain/calculators/WorkoutGrouper';
import {
  MULTIPLE_WORKOUTS,
  SAME_DAY_WORKOUTS,
  GROUPED_BY_ACTIVITY_WORKOUTS,
  EMPTY_WORKOUTS,
} from '../../../../fixtures/workouts.fixture';

describe('WorkoutGrouper', () => {
  describe('groupByDate', () => {
    it('should group workouts by date', () => {
      const grouped = WorkoutGrouper.groupByDate(MULTIPLE_WORKOUTS);

      const dates = Object.keys(grouped);
      expect(dates.length).toBe(3); // 3 different days

      // Each date should have 1 workout
      Object.values(grouped).forEach((workouts) => {
        expect(workouts.length).toBe(1);
      });
    });

    it('should group multiple workouts on same day', () => {
      const grouped = WorkoutGrouper.groupByDate(SAME_DAY_WORKOUTS);

      const dates = Object.keys(grouped);
      expect(dates.length).toBe(1); // 1 day

      // Should have 2 workouts on that day
      const dayWorkouts = Object.values(grouped)[0];
      expect(dayWorkouts.length).toBe(2);
    });

    it('should handle empty array', () => {
      const grouped = WorkoutGrouper.groupByDate(EMPTY_WORKOUTS);
      expect(grouped).toEqual({});
    });
  });

  describe('groupByDateAsArray', () => {
    it('should return grouped workouts as array', () => {
      const grouped = WorkoutGrouper.groupByDateAsArray(MULTIPLE_WORKOUTS);

      expect(Array.isArray(grouped)).toBe(true);
      expect(grouped.length).toBe(3);

      grouped.forEach((group) => {
        expect(group).toHaveProperty('date');
        expect(group).toHaveProperty('workouts');
        expect(Array.isArray(group.workouts)).toBe(true);
      });
    });
  });

  describe('groupByActivityType', () => {
    it('should group workouts by activity type', () => {
      const grouped = WorkoutGrouper.groupByActivityType(GROUPED_BY_ACTIVITY_WORKOUTS);

      expect(grouped[8]).toHaveLength(2); // 2 running workouts (type 8)
      expect(grouped[84]).toHaveLength(1); // 1 swimming workout (type 84)
    });

    it('should handle empty array', () => {
      const grouped = WorkoutGrouper.groupByActivityType(EMPTY_WORKOUTS);
      expect(grouped).toEqual({});
    });
  });

  describe('groupByActivityName', () => {
    it('should group workouts by activity name', () => {
      const grouped = WorkoutGrouper.groupByActivityName(GROUPED_BY_ACTIVITY_WORKOUTS);

      expect(grouped['Running']).toHaveLength(2);
      expect(grouped['Swimming']).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const grouped = WorkoutGrouper.groupByActivityName(EMPTY_WORKOUTS);
      expect(grouped).toEqual({});
    });
  });
});
