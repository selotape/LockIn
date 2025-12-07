/**
 * Tests for duration-formatter utility
 */

import {
  formatDuration,
  formatDurationAsHours,
  formatDurationAsMinutes,
  millisecondsToHours,
  millisecondsToMinutes,
} from '@/frontend/utils/duration-formatter';

describe('duration-formatter', () => {
  describe('formatDuration', () => {
    it('should format duration with hours and minutes', () => {
      const duration = 2 * 60 * 60 * 1000 + 30 * 60 * 1000; // 2h 30m
      expect(formatDuration(duration)).toBe('2h 30m');
    });

    it('should format duration with only hours (no remaining minutes)', () => {
      const duration = 2 * 60 * 60 * 1000; // 2h 0m
      expect(formatDuration(duration)).toBe('2h 0m');
    });

    it('should format duration with only minutes', () => {
      const duration = 45 * 60 * 1000; // 45m
      expect(formatDuration(duration)).toBe('45m');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0m');
    });

    it('should round to nearest minute', () => {
      const duration = 45 * 60 * 1000 + 30 * 1000; // 45.5m
      expect(formatDuration(duration)).toBe('45m');
    });
  });

  describe('formatDurationAsHours', () => {
    it('should format duration as hours with decimal', () => {
      const duration = 2.5 * 60 * 60 * 1000; // 2.5h
      expect(formatDurationAsHours(duration)).toBe('2.5h');
    });

    it('should round to 1 decimal place', () => {
      const duration = 1.23 * 60 * 60 * 1000; // 1.23h
      expect(formatDurationAsHours(duration)).toBe('1.2h');
    });
  });

  describe('formatDurationAsMinutes', () => {
    it('should format duration as total minutes', () => {
      const duration = 2 * 60 * 60 * 1000 + 30 * 60 * 1000; // 2h 30m = 150m
      expect(formatDurationAsMinutes(duration)).toBe('150m');
    });
  });

  describe('millisecondsToHours', () => {
    it('should convert milliseconds to hours', () => {
      const hours = millisecondsToHours(3600000); // 1 hour
      expect(hours).toBe(1);
    });

    it('should return decimal hours', () => {
      const hours = millisecondsToHours(5400000); // 1.5 hours
      expect(hours).toBe(1.5);
    });
  });

  describe('millisecondsToMinutes', () => {
    it('should convert milliseconds to minutes', () => {
      const minutes = millisecondsToMinutes(60000); // 1 minute
      expect(minutes).toBe(1);
    });

    it('should floor to integer minutes', () => {
      const minutes = millisecondsToMinutes(90000); // 1.5 minutes
      expect(minutes).toBe(1);
    });
  });
});
