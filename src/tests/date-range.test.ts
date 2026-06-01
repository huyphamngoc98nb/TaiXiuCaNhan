import { describe, expect, it } from 'vitest';
import {
  addMonths,
  endOfMonth,
  getMonthDateRange,
  isCurrentMonth,
  startOfMonth,
  toMonthKey,
} from '@/shared/utils/date-range';

describe('date-range utils', () => {
  it('builds local start and end boundaries for a month key', () => {
    expect(startOfMonth('2026-02')).toBe(new Date(2026, 1, 1, 0, 0, 0, 0).getTime());
    expect(endOfMonth('2026-02')).toBe(new Date(2026, 1, 28, 23, 59, 59, 999).getTime());
    expect(getMonthDateRange('2026-02')).toEqual({
      startDate: new Date(2026, 1, 1, 0, 0, 0, 0).getTime(),
      endDate: new Date(2026, 1, 28, 23, 59, 59, 999).getTime(),
    });
  });

  it('keeps month keys stable across year boundaries', () => {
    expect(toMonthKey(new Date(2026, 0, 10))).toBe('2026-01');
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(addMonths('2026-12', 1)).toBe('2027-01');
  });

  it('detects the current month from a supplied clock', () => {
    expect(isCurrentMonth('2026-06', new Date(2026, 5, 1))).toBe(true);
    expect(isCurrentMonth('2026-05', new Date(2026, 5, 1))).toBe(false);
  });
});
