import { RecurringBill } from '../domain/recurring-bill.model';

type Frequency = RecurringBill['frequency'];

/**
 * Compute the next due date after `fromDateMs` for a given frequency.
 *
 * Edge-case rules:
 * - Monthly: adds exactly 1 month; if day overflows (e.g. Jan 31 → Mar 3),
 *   clamps to last day of target month.
 * - Yearly: same as monthly but +1 year; includes Feb 29 clamp for non-leap years.
 *   e.g. Feb 29, 2024 → Feb 28, 2025 (not Mar 1).
 * - Daily/Weekly: fixed ms offsets.
 *
 * @param fromDateMs  - the current due date in unix ms
 * @param frequency   - recurrence frequency
 */
export function computeNextDueDate(fromDateMs: number, frequency: Frequency): number {
  const d = new Date(fromDateMs);

  switch (frequency) {
    case 'daily':
      return fromDateMs + 86_400_000;

    case 'weekly':
      return fromDateMs + 7 * 86_400_000;

    case 'monthly': {
      const targetYear = d.getFullYear();
      const targetMonth = d.getMonth() + 1; // +1 month
      const originalDay = d.getDate();

      const next = new Date(targetYear, targetMonth, originalDay);

      // Day overflow: Jan 31 → targetMonth=1 day=31 → JS rolls to Mar 3
      // Clamp: lấy ngày cuối cùng của targetMonth (day=0 của tháng kế tiếp)
      if (next.getDate() !== originalDay) {
        return new Date(targetYear, targetMonth + 1, 0).getTime();
      }
      return next.getTime();
    }

    case 'yearly': {
      const targetYear = d.getFullYear() + 1;
      const targetMonth = d.getMonth(); // 0-indexed
      const originalDay = d.getDate();

      const next = new Date(targetYear, targetMonth, originalDay);

      // WARN-3 fix: Feb 29 của năm nhuận → năm thường không có ngày 29
      // JS tự roll sang Mar 1 — clamp về Feb 28 (= day 0 của tháng 3)
      if (next.getDate() !== originalDay) {
        return new Date(targetYear, targetMonth + 1, 0).getTime();
      }
      return next.getTime();
    }

    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}
