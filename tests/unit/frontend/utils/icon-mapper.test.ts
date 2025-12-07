/**
 * Tests for icon-mapper utility
 */

import {
  getWorkoutIcon,
  getWorkoutIconExact,
  hasWorkoutIcon,
  getAllActivityIcons,
} from '@/frontend/utils/icon-mapper';

describe('icon-mapper', () => {
  describe('getWorkoutIcon', () => {
    it('should return correct icon for known activities', () => {
      expect(getWorkoutIcon('Running')).toBe('🏃‍♀️');
      expect(getWorkoutIcon('Swimming')).toBe('🏊‍♀️');
      expect(getWorkoutIcon('Yoga')).toBe('🧘‍♀️');
      expect(getWorkoutIcon('Cycling')).toBe('🚴‍♀️');
    });

    it('should be case insensitive', () => {
      expect(getWorkoutIcon('running')).toBe('🏃‍♀️');
      expect(getWorkoutIcon('RUNNING')).toBe('🏃‍♀️');
      expect(getWorkoutIcon('RuNnInG')).toBe('🏃‍♀️');
    });

    it('should handle partial matches', () => {
      expect(getWorkoutIcon('Morning Running')).toBe('🏃‍♀️');
      expect(getWorkoutIcon('Pool Swimming')).toBe('🏊‍♀️');
    });

    it('should return default icon for unknown activities', () => {
      expect(getWorkoutIcon('Unknown Activity')).toBe('🏃‍♀️');
      expect(getWorkoutIcon('Random Exercise')).toBe('🏃‍♀️');
    });
  });

  describe('getWorkoutIconExact', () => {
    it('should return icon for exact matches', () => {
      expect(getWorkoutIconExact('Running')).toBe('🏃‍♀️');
      expect(getWorkoutIconExact('Swimming')).toBe('🏊‍♀️');
    });

    it('should return default for non-exact matches', () => {
      expect(getWorkoutIconExact('running')).toBe('🏃‍♀️'); // default
      expect(getWorkoutIconExact('Morning Running')).toBe('🏃‍♀️'); // default
    });
  });

  describe('hasWorkoutIcon', () => {
    it('should return true for known activities', () => {
      expect(hasWorkoutIcon('Running')).toBe(true);
      expect(hasWorkoutIcon('Swimming')).toBe(true);
      expect(hasWorkoutIcon('Yoga')).toBe(true);
    });

    it('should return false for unknown activities', () => {
      expect(hasWorkoutIcon('Unknown Activity')).toBe(false);
      expect(hasWorkoutIcon('Random Exercise')).toBe(false);
    });

    it('should work with partial matches', () => {
      expect(hasWorkoutIcon('Morning Running')).toBe(true);
      expect(hasWorkoutIcon('Pool Swimming')).toBe(true);
    });
  });

  describe('getAllActivityIcons', () => {
    it('should return all activity icons', () => {
      const icons = getAllActivityIcons();

      expect(Object.keys(icons).length).toBeGreaterThan(0);
      expect(icons['Running']).toBe('🏃‍♀️');
      expect(icons['Swimming']).toBe('🏊‍♀️');
      expect(icons['Yoga']).toBe('🧘‍♀️');
    });

    it('should return a copy (not modify original)', () => {
      const icons = getAllActivityIcons();
      icons['NewActivity'] = '🎯';

      const iconsAgain = getAllActivityIcons();
      expect(iconsAgain['NewActivity']).toBeUndefined();
    });
  });
});
