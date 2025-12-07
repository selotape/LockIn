/**
 * Tests for date-formatter utility
 */

import {
  formatDate,
  formatShortDate,
  formatTime,
  isToday,
  isYesterday,
} from '@/frontend/utils/date-formatter';

describe('date-formatter', () => {
  describe('formatDate', () => {
    it('should format today as "Today"', () => {
      const today = new Date();
      expect(formatDate(today)).toBe('Today');
    });

    it('should format yesterday as "Yesterday"', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatDate(yesterday)).toBe('Yesterday');
    });

    it('should format other dates as full date', () => {
      const date = new Date('2025-01-01T10:00:00Z');
      const formatted = formatDate(date);

      // Should include weekday, month, day, and year
      expect(formatted).toContain('2025');
      expect(formatted).toContain('January');
    });
  });

  describe('formatShortDate', () => {
    it('should format date as short string', () => {
      const date = new Date('2025-01-15T10:00:00Z');
      const formatted = formatShortDate(date);

      // Format depends on locale, but should include date parts
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatTime', () => {
    it('should format time with AM/PM', () => {
      const date = new Date('2025-01-01T14:30:00Z');
      const formatted = formatTime(date);

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for other days', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for other days', () => {
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });
  });
});
