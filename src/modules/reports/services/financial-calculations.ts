import type { BudgetProgress, BudgetStatus, BudgetWithCategory } from '@/modules/budgets/domain/budget.model';
import { resolveBudgetScope } from '@/modules/budgets/domain/budget.model';
import { classifyBudgetStatus } from '@/modules/budgets/services/classify-budget-status';
import type { CategorySummary, CashflowSummary, DateRange } from '../domain/report.model';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type ForecastStatus = 'good' | 'warning' | 'danger';

export interface FinancialMonthMetrics {
  monthlyIncome: number;
  monthlyExpense: number;
  dailyAverageExpense: number;
  projectedMonthlyExpense: number;
  projectedMonthEndBalance: number;
  projectedAdditionalExpense: number;
  previousMonthExpenseChangePercent: number | null;
  previousMonthIncomeChangePercent: number | null;
  elapsedDays: number;
  daysInMonth: number;
  hasCurrentData: boolean;
  hasPreviousData: boolean;
  status: ForecastStatus;
}

export interface CategorySpendingMetric extends CategorySummary {
  percentage: number;
}

export interface BudgetUsageMetric {
  spentAmount: number;
  limitAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  status: BudgetStatus;
  projectedSpentAmount: number;
  projectedUsagePercentage: number;
  projectedStatus: BudgetStatus;
  isProjectedExceeded: boolean;
}

export function countInclusiveDays(startDate: number, endDate: number): number {
  return Math.max(1, Math.ceil((endDate - startDate + 1) / MS_PER_DAY));
}

export function getElapsedDaysInRange(range: DateRange, now = new Date()): number {
  const nowTime = now.getTime();
  if (nowTime <= range.startDate) return 1;
  if (nowTime >= range.endDate) return countInclusiveDays(range.startDate, range.endDate);
  return countInclusiveDays(range.startDate, nowTime);
}

function percentChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export function classifyForecastStatus(
  projectedMonthEndBalance: number,
  totalBalance: number,
  projectedBudgetUsage = 0,
): ForecastStatus {
  if (projectedMonthEndBalance < 0 || projectedBudgetUsage >= 1.1) return 'danger';
  if (projectedMonthEndBalance <= Math.max(totalBalance * 0.1, 0) || projectedBudgetUsage >= 1) {
    return 'warning';
  }
  return 'good';
}

export function calculateMonthMetrics(input: {
  current: CashflowSummary;
  previous?: CashflowSummary | null;
  currentRange: DateRange;
  totalBalance: number;
  maxProjectedBudgetUsage?: number;
  now?: Date;
}): FinancialMonthMetrics {
  const elapsedDays = getElapsedDaysInRange(input.currentRange, input.now);
  const daysInMonth = countInclusiveDays(input.currentRange.startDate, input.currentRange.endDate);
  const monthlyIncome = input.current.totalIncome;
  const monthlyExpense = input.current.totalExpense;
  const dailyAverageExpense = monthlyExpense / elapsedDays;
  const projectedMonthlyExpense = dailyAverageExpense * daysInMonth;
  const projectedAdditionalExpense = Math.max(projectedMonthlyExpense - monthlyExpense, 0);
  const projectedMonthEndBalance = input.totalBalance - projectedAdditionalExpense;
  const previous = input.previous ?? null;

  return {
    monthlyIncome,
    monthlyExpense,
    dailyAverageExpense,
    projectedMonthlyExpense,
    projectedMonthEndBalance,
    projectedAdditionalExpense,
    previousMonthExpenseChangePercent: previous
      ? percentChange(monthlyExpense, previous.totalExpense)
      : null,
    previousMonthIncomeChangePercent: previous
      ? percentChange(monthlyIncome, previous.totalIncome)
      : null,
    elapsedDays,
    daysInMonth,
    hasCurrentData: monthlyIncome > 0 || monthlyExpense > 0,
    hasPreviousData: Boolean(previous && (previous.totalIncome > 0 || previous.totalExpense > 0)),
    status: classifyForecastStatus(
      projectedMonthEndBalance,
      input.totalBalance,
      input.maxProjectedBudgetUsage ?? 0,
    ),
  };
}

export function calculateSpendingByCategory(items: CategorySummary[]): CategorySpendingMetric[] {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return items.map(item => ({
    ...item,
    percentage: total > 0 ? item.amount / total : 0,
  }));
}

export function calculateBudgetUsage(input: {
  budget: BudgetWithCategory;
  spentAmount: number;
  range: DateRange;
  now?: Date;
}): BudgetUsageMetric {
  const limitAmount = input.budget.amount;
  const usagePercentage = limitAmount > 0 ? input.spentAmount / limitAmount : 0;
  const elapsedDays = getElapsedDaysInRange(input.range, input.now);
  const periodDays = countInclusiveDays(input.range.startDate, input.range.endDate);
  const projectedSpentAmount = elapsedDays > 0
    ? (input.spentAmount / elapsedDays) * periodDays
    : input.spentAmount;
  const projectedUsagePercentage = limitAmount > 0 ? projectedSpentAmount / limitAmount : 0;

  return {
    spentAmount: input.spentAmount,
    limitAmount,
    remainingAmount: limitAmount - input.spentAmount,
    usagePercentage,
    status: classifyBudgetStatus(usagePercentage),
    projectedSpentAmount,
    projectedUsagePercentage,
    projectedStatus: classifyBudgetStatus(projectedUsagePercentage),
    isProjectedExceeded: projectedUsagePercentage >= 1,
  };
}

const BUDGET_STATUS_ORDER: Record<BudgetStatus, number> = {
  exceeded: 0,
  warning: 1,
  safe: 2,
};

export function enrichBudgetProgress(
  budget: BudgetWithCategory,
  usage: BudgetUsageMetric,
): BudgetProgress {
  return {
    budget,
    spent_amount: usage.spentAmount,
    remaining_amount: usage.remainingAmount,
    percentage: usage.usagePercentage,
    status: usage.status,
    projected_spent_amount: usage.projectedSpentAmount,
    projected_percentage: usage.projectedUsagePercentage,
    projected_status: usage.projectedStatus,
    is_projected_exceeded: usage.isProjectedExceeded,
  };
}

export function sortBudgetProgressByAttention(progress: BudgetProgress[]): BudgetProgress[] {
  return [...progress].sort((a, b) => {
    const statusDiff = BUDGET_STATUS_ORDER[a.status] - BUDGET_STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    const projectedDiff = Number(b.is_projected_exceeded) - Number(a.is_projected_exceeded);
    if (projectedDiff !== 0) return projectedDiff;
    return b.percentage - a.percentage;
  });
}

export function resolveBudgetTransactionFilter(budget: BudgetWithCategory) {
  const scope = resolveBudgetScope(budget);
  return {
    category_id: budget.category_id,
    type: 'expense' as const,
    wallet_id: scope.type === 'wallet' ? scope.walletId : undefined,
  };
}
