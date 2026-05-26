import { describe, expect, it } from 'vitest';
import { normalizeDonutData } from '@/modules/reports/components/normalize-donut-data';

const colors = ['#111', '#222', '#333', '#444', '#555', '#666'];

describe('normalizeDonutData', () => {
  it('sorts items and groups anything beyond top N into Other', () => {
    const result = normalizeDonutData(
      [
        { label: 'Small', amount: 10 },
        { label: 'Largest', amount: 50 },
        { label: 'Medium', amount: 30 },
        { label: 'Tiny', amount: 5 },
      ],
      { colors, otherLabel: 'Other', topN: 2, minPercent: 0 },
    );

    expect(result.map(item => item.label)).toEqual(['Largest', 'Medium', 'Other']);
    expect(result[2].amount).toBe(15);
  });

  it('groups slices below the minimum percent into Other', () => {
    const result = normalizeDonutData(
      [
        { label: 'Salary', amount: 920 },
        { label: 'Bonus', amount: 40 },
        { label: 'Refund', amount: 40 },
      ],
      { colors, otherLabel: 'Other', topN: 5, minPercent: 5 },
    );

    expect(result.map(item => item.label)).toEqual(['Salary', 'Other']);
    expect(result[1].percent).toBeCloseTo(8);
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
