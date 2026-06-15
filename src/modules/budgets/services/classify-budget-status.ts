import { BudgetStatus } from '../domain/budget.model';

export const BUDGET_THRESHOLDS = {
  WARNING: 0.7, // 70%
  EXCEEDED: 1.0, // 100%
};

export function classifyBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= BUDGET_THRESHOLDS.EXCEEDED) {
    return 'exceeded';
  }
  if (percentage >= BUDGET_THRESHOLDS.WARNING) {
    return 'warning';
  }
  return 'safe';
}
