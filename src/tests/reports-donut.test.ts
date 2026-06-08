import { describe, expect, it } from 'vitest';
import { normalizeDonutData } from '@/modules/reports/components/normalize-donut-data';

const colors = ['#111', '#222', '#333', '#444', '#555', '#666'];

describe('normalizeDonutData', () => {
  it('keeps all positive items sorted by amount and ignores grouping options', () => {
    const result = normalizeDonutData(
      [
        { label: 'Small', amount: 10 },
        { label: 'Largest', amount: 50 },
        { label: 'Medium', amount: 30 },
        { label: 'Tiny', amount: 5 },
      ],
      { colors, otherLabel: 'Other', topN: 2, minPercent: 0 },
    );

    expect(result.map(item => item.label)).toEqual(['Largest', 'Medium', 'Small', 'Tiny']);
    expect(result.map(item => item.amount)).toEqual([50, 30, 10, 5]);
    expect(result.some(item => item.label === 'Other' || item.isOther === true)).toBe(false);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100);
  });

  it('does not group slices below the minimum percent into Other', () => {
    const result = normalizeDonutData(
      [
        { label: 'Salary', amount: 920 },
        { label: 'Bonus', amount: 40 },
        { label: 'Refund', amount: 40 },
      ],
      { colors, otherLabel: 'Other', topN: 5, minPercent: 5 },
    );

    expect(result.map(item => item.label)).toEqual(['Salary', 'Bonus', 'Refund']);
    expect(result.every(item => item.isOther === false)).toBe(true);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100);
  });

  it('keeps more than the previous five item limit', () => {
    const result = normalizeDonutData(
      Array.from({ length: 10 }, (_, index) => ({
        label: `Category ${index + 1}`,
        amount: 100 - index,
      })),
      { colors, otherLabel: 'Other' },
    );

    expect(result).toHaveLength(10);
    expect(result.some(item => item.label === 'Other' || item.isOther === true)).toBe(false);
    expect(result.reduce((sum, item) => sum + item.percent, 0)).toBeCloseTo(100);
  });

  it('filters non-positive amounts and falls back blank labels to Uncategorized', () => {
    const result = normalizeDonutData(
      [
        { label: '  ', amount: 25 },
        { label: 'Food', amount: 0 },
        { label: 'Bills', amount: -10 },
      ],
      { colors, otherLabel: 'Other' },
    );

    expect(result.map(item => item.label)).toEqual(['Uncategorized']);
    expect(result[0].percent).toBe(100);
    expect(result[0].isOther).toBe(false);
  });

  it('returns an empty array when total is zero', () => {
    const result = normalizeDonutData(
      [
        { label: 'Food', amount: 0 },
        { label: 'Bills', amount: -10 },
      ],
      { colors, otherLabel: 'Other' },
    );

    expect(result).toEqual([]);
  });
});
