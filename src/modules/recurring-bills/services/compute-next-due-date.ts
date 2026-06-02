import { RecurringBill } from '../domain/recurring-bill.model';

type Frequency = RecurringBill['frequency'];

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function withLocalDate(
  source: Date,
  year: number,
  monthIndex: number,
  day: number,
): number {
  return new Date(
    year,
    monthIndex,
    day,
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds(),
  ).getTime();
}

function addLocalCalendarDays(fromDateMs: number, days: number): number {
  const source = new Date(fromDateMs);
  return withLocalDate(
    source,
    source.getFullYear(),
    source.getMonth(),
    source.getDate() + days,
  );
}

function addLocalCalendarMonthsClamped(fromDateMs: number, months: number): number {
  const source = new Date(fromDateMs);
  const target = new Date(source.getFullYear(), source.getMonth() + months, 1);
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth();
  const targetDay = Math.min(
    source.getDate(),
    lastDayOfMonth(targetYear, targetMonth),
  );

  return withLocalDate(source, targetYear, targetMonth, targetDay);
}

/**
 * Compute the next due date after `fromDateMs` for a given frequency.
 *
 * Due dates are calendar recurrences in local time:
 * - Daily/weekly add calendar days, not fixed millisecond offsets. This keeps
 *   the local due time stable across daylight-saving transitions.
 * - Monthly adds one calendar month. If the current due day does not exist in
 *   the target month, clamp to the target month's last day.
 *   Example: Jan 31 -> Feb 28/29, Mar 31 -> Apr 30.
 * - Yearly adds twelve calendar months with the same clamp rule.
 *   Example: Feb 29, 2024 -> Feb 28, 2025.
 *
 * The current `next_due_date` is the source date for the next cycle; the model
 * does not store a separate original anchor day.
 */
export function computeNextDueDate(fromDateMs: number, frequency: Frequency): number {
  switch (frequency) {
    case 'daily':
      return addLocalCalendarDays(fromDateMs, 1);

    case 'weekly':
      return addLocalCalendarDays(fromDateMs, 7);

    case 'monthly':
      return addLocalCalendarMonthsClamped(fromDateMs, 1);

    case 'yearly':
      return addLocalCalendarMonthsClamped(fromDateMs, 12);

    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}
