import { describe, expect, it } from 'vitest';
import type { BudgetWithCategory } from '@/modules/budgets/domain/budget.model';
import {
  calculateBudgetUsage,
  calculateMonthMetrics,
  calculateSpendingByCategory,
} from '@/modules/reports/services/financial-calculations';

const monthlyRange = {
  startDate: new Date(2026, 5, 1, 0, 0, 0, 0).getTime(),
  endDate: new Date(2026, 5, 30, 23, 59, 59, 999).getTime(),
};

function makeBudget(amount: number): BudgetWithCategory {
  return {
    id: 'budget-1',
    category_id: 'food',
    wallet_id: null,
    account_type_scope: null,
    amount,
    period: 'monthly',
    start_date: monthlyRange.startDate,
    end_date: null,
    is_active: true,
    created_at: 0,
    updated_at: 0,
    category_name: 'Food',
    category_type: 'expense',
  };
}

describe('financial calculations', () => {
  it('projects month-end expense and balance from elapsed days', () => {
    const metrics = calculateMonthMetrics({
      current: {
        grossIncome: 3_000,
        grossExpense: 1_200,
        totalOffset: 200,
        netExpense: 1_000,
        totalIncome: 3_000,
        totalExpense: 1_000,
        netAmount: 2_000,
      },
      previous: {
        grossIncome: 2_000,
        grossExpense: 600,
        totalOffset: 100,
        netExpense: 500,
        totalIncome: 2_000,
        totalExpense: 500,
        netAmount: 1_500,
      },
      currentRange: monthlyRange,
      totalBalance: 5_000,
      now: new Date(2026, 5, 10, 12, 0, 0, 0),
    });

    expect(metrics.dailyAverageExpense).toBe(100);
    expect(metrics.projectedMonthlyExpense).toBe(3_000);
    expect(metrics.projectedMonthEndBalance).toBe(3_000);
    expect(metrics.previousMonthExpenseChangePercent).toBe(100);
  });

  it('calculates spending percentages by category', () => {
    const items = calculateSpendingByCategory([
      { category_id: 'food', category_name: 'Food', amount: 300, type: 'expense' },
      { category_id: 'travel', category_name: 'Travel', amount: 100, type: 'expense' },
    ]);

    expect(items[0].percentage).toBe(0.75);
    expect(items[1].percentage).toBe(0.25);
  });

  it('marks projected budget overrun before the raw usage reaches 100%', () => {
    const usage = calculateBudgetUsage({
      budget: makeBudget(1_000),
      spentAmount: 500,
      range: monthlyRange,
      now: new Date(2026, 5, 10, 12, 0, 0, 0),
    });

    expect(usage.usagePercentage).toBe(0.5);
    expect(usage.status).toBe('safe');
    expect(usage.projectedUsagePercentage).toBe(1.5);
    expect(usage.isProjectedExceeded).toBe(true);
  });
});
