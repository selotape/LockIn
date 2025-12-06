/**
 * Tests for activity type mapper
 */

import {
  getActivityName,
  getAllActivityTypeCodes,
  isKnownActivityType,
  getActivityTypeByName,
  getAllActivityNames,
  getActivityTypeMap,
} from '@/backend/infrastructure/mappers/activity-type.mapper';

describe('Activity Type Mapper', () => {
  describe('getActivityName', () => {
    it('should return correct name for known activity types', () => {
      expect(getActivityName(8)).toBe('Running');
      expect(getActivityName(102)).toBe('Yoga');
      expect(getActivityName(1)).toBe('Biking');
      expect(getActivityName(84)).toBe('Swimming');
      expect(getActivityName(7)).toBe('Walking');
    });

    it('should return fallback name for unknown activity types', () => {
      expect(getActivityName(999)).toBe('Activity 999');
      expect(getActivityName(0)).toBe('Activity 0');
      expect(getActivityName(-1)).toBe('Activity -1');
    });

    it('should handle edge cases', () => {
      expect(getActivityName(113)).toBe('Other');
      expect(getActivityName(1)).toBe('Biking');
    });
  });

  describe('getAllActivityTypeCodes', () => {
    it('should return array of all activity type codes', () => {
      const codes = getAllActivityTypeCodes();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBeGreaterThan(100);
      expect(codes).toContain(8); // Running
      expect(codes).toContain(102); // Yoga
    });

    it('should return all codes as numbers', () => {
      const codes = getAllActivityTypeCodes();
      codes.forEach((code) => {
        expect(typeof code).toBe('number');
      });
    });
  });

  describe('isKnownActivityType', () => {
    it('should return true for known activity types', () => {
      expect(isKnownActivityType(8)).toBe(true);
      expect(isKnownActivityType(102)).toBe(true);
      expect(isKnownActivityType(1)).toBe(true);
    });

    it('should return false for unknown activity types', () => {
      expect(isKnownActivityType(999)).toBe(false);
      expect(isKnownActivityType(0)).toBe(false);
      expect(isKnownActivityType(-1)).toBe(false);
    });
  });

  describe('getActivityTypeByName', () => {
    it('should return correct code for known activity names', () => {
      expect(getActivityTypeByName('Running')).toBe(8);
      expect(getActivityTypeByName('Yoga')).toBe(102);
      expect(getActivityTypeByName('Biking')).toBe(1);
      expect(getActivityTypeByName('Swimming')).toBe(84);
    });

    it('should be case-insensitive', () => {
      expect(getActivityTypeByName('running')).toBe(8);
      expect(getActivityTypeByName('YOGA')).toBe(102);
      expect(getActivityTypeByName('BiKiNg')).toBe(1);
    });

    it('should handle whitespace', () => {
      expect(getActivityTypeByName('  Running  ')).toBe(8);
      expect(getActivityTypeByName(' Yoga ')).toBe(102);
    });

    it('should return undefined for unknown activity names', () => {
      expect(getActivityTypeByName('Unknown Activity')).toBeUndefined();
      expect(getActivityTypeByName('NotARealActivity')).toBeUndefined();
      expect(getActivityTypeByName('')).toBeUndefined();
    });
  });

  describe('getAllActivityNames', () => {
    it('should return array of all activity names', () => {
      const names = getAllActivityNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(100);
      expect(names).toContain('Running');
      expect(names).toContain('Yoga');
      expect(names).toContain('Swimming');
    });

    it('should return all names as strings', () => {
      const names = getAllActivityNames();
      names.forEach((name) => {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getActivityTypeMap', () => {
    it('should return complete activity type mapping', () => {
      const map = getActivityTypeMap();
      expect(typeof map).toBe('object');
      expect(Object.keys(map).length).toBeGreaterThan(100);
    });

    it('should have correct mappings', () => {
      const map = getActivityTypeMap();
      expect(map[8]).toBe('Running');
      expect(map[102]).toBe('Yoga');
      expect(map[1]).toBe('Biking');
    });

    it('should return a copy (not original)', () => {
      const map1 = getActivityTypeMap();
      const map2 = getActivityTypeMap();
      expect(map1).not.toBe(map2); // Different references
      expect(map1).toEqual(map2); // Same content
    });
  });
});
