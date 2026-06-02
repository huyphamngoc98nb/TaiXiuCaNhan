import { describe, it, expect } from 'vitest';
import { computeNextDueDate } from '../modules/recurring-bills/services/compute-next-due-date';
import { classifyDueStatus, daysDiff } from '../modules/recurring-bills/services/classify-due-status';

describe('Recurring Bills Logic', () => {
  describe('computeNextDueDate', () => {
    function localDate(year: number, monthIndex: number, day: number, hour = 0) {
      return new Date(year, monthIndex, day, hour).getTime();
    }

    function expectLocalDate(ms: number, year: number, monthIndex: number, day: number, hour = 0) {
      const date = new Date(ms);
      expect(date.getFullYear()).toBe(year);
      expect(date.getMonth()).toBe(monthIndex);
      expect(date.getDate()).toBe(day);
      expect(date.getHours()).toBe(hour);
    }

    it('computes next day and next week as local calendar dates', () => {
      expectLocalDate(
        computeNextDueDate(localDate(2026, 0, 15, 9), 'daily'),
        2026,
        0,
        16,
        9,
      );
      expectLocalDate(
        computeNextDueDate(localDate(2026, 0, 15, 9), 'weekly'),
        2026,
        0,
        22,
        9,
      );
    });

    it('computes next month correctly', () => {
      const start = localDate(2026, 0, 15); // Jan 15
      const next = computeNextDueDate(start, 'monthly');
      expectLocalDate(next, 2026, 1, 15); // Feb 15
    });

    it('clamps monthly recurrence from Jan 31 to Feb 28 in non-leap years', () => {
      const next = computeNextDueDate(localDate(2026, 0, 31), 'monthly');
      expectLocalDate(next, 2026, 1, 28);
    });

    it('clamps monthly recurrence from Jan 31 to Feb 29 in leap years', () => {
      const next = computeNextDueDate(localDate(2024, 0, 31), 'monthly');
      expectLocalDate(next, 2024, 1, 29);
    });

    it('clamps monthly recurrence from Jan 30 to February end', () => {
      expectLocalDate(
        computeNextDueDate(localDate(2026, 0, 30), 'monthly'),
        2026,
        1,
        28,
      );
      expectLocalDate(
        computeNextDueDate(localDate(2024, 0, 30), 'monthly'),
        2024,
        1,
        29,
      );
    });

    it('clamps monthly recurrence from a 31-day month to a 30-day month', () => {
      const next = computeNextDueDate(localDate(2026, 2, 31), 'monthly'); // Mar 31
      expectLocalDate(next, 2026, 3, 30); // Apr 30
    });

    it('keeps monthly recurrence day when the target month has that day', () => {
      const next = computeNextDueDate(localDate(2024, 1, 29), 'monthly'); // Feb 29
      expectLocalDate(next, 2024, 2, 29); // Mar 29
    });

    it('handles monthly year rollover', () => {
      const next = computeNextDueDate(localDate(2026, 11, 31), 'monthly'); // Dec 31
      expectLocalDate(next, 2027, 0, 31); // Jan 31
    });

    it('computes next year correctly', () => {
      const start = localDate(2026, 5, 1);
      const next = computeNextDueDate(start, 'yearly');
      expectLocalDate(next, 2027, 5, 1);
    });

    it('clamps yearly recurrence from Feb 29 to Feb 28 in non-leap years', () => {
      const next = computeNextDueDate(localDate(2024, 1, 29), 'yearly');
      expectLocalDate(next, 2025, 1, 28);
    });

    it('keeps yearly recurrence day when the target year has that date', () => {
      const next = computeNextDueDate(localDate(2027, 1, 28), 'yearly');
      expectLocalDate(next, 2028, 1, 28);
    });

    it('preserves local time of day for monthly and yearly recurrence', () => {
      expectLocalDate(
        computeNextDueDate(localDate(2026, 0, 31, 9), 'monthly'),
        2026,
        1,
        28,
        9,
      );
      expectLocalDate(
        computeNextDueDate(localDate(2024, 1, 29, 9), 'yearly'),
        2025,
        1,
        28,
        9,
      );
    });
  });

  describe('classifyDueStatus', () => {
    const today = new Date(2026, 4, 10, 12, 0).getTime(); // May 10, 12:00
    const reminderDays = 3;

    it('identifies overdue', () => {
      const due = new Date(2026, 4, 9).getTime(); // May 9
      expect(classifyDueStatus(due, reminderDays, today)).toBe('overdue');
    });

    it('identifies due today', () => {
      const due = new Date(2026, 4, 10, 23, 0).getTime(); // May 10
      expect(classifyDueStatus(due, reminderDays, today)).toBe('due_today');
    });

    it('identifies upcoming within window', () => {
      const due = new Date(2026, 4, 12).getTime(); // May 12 (2 days away)
      expect(classifyDueStatus(due, reminderDays, today)).toBe('upcoming');
    });

    it('returns null outside window', () => {
      const due = new Date(2026, 4, 15).getTime(); // May 15 (5 days away)
      expect(classifyDueStatus(due, reminderDays, today)).toBe(null);
    });
  });

  describe('daysDiff', () => {
    const today = new Date(2026, 4, 10).getTime();
    
    it('returns 0 for same day', () => {
      expect(daysDiff(today, today)).toBe(0);
    });

    it('returns positive for future', () => {
      const future = new Date(2026, 4, 12).getTime();
      expect(daysDiff(future, today)).toBe(2);
    });

    it('returns negative for past', () => {
      const past = new Date(2026, 4, 8).getTime();
      expect(daysDiff(past, today)).toBe(-2);
    });
  });
});
