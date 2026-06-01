export interface DateRange {
  startDate: number;
  endDate: number;
}

export function toMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function parseMonthKey(monthKey: string): Date {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1, 0, 0, 0, 0);
}

function coerceMonthDate(value: Date | string): Date {
  return typeof value === 'string' ? parseMonthKey(value) : value;
}

export function startOfMonth(value: Date | string): number {
  const date = coerceMonthDate(value);
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0).getTime();
}

export function endOfMonth(value: Date | string): number {
  const date = coerceMonthDate(value);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
}

export function getMonthDateRange(monthKey: string): DateRange {
  return {
    startDate: startOfMonth(monthKey),
    endDate: endOfMonth(monthKey),
  };
}

export function addMonths(monthKey: string, amount: number): string {
  const date = parseMonthKey(monthKey);
  return toMonthKey(new Date(date.getFullYear(), date.getMonth() + amount, 1));
}

export function isCurrentMonth(monthKey: string, now = new Date()): boolean {
  return monthKey === toMonthKey(now);
}
