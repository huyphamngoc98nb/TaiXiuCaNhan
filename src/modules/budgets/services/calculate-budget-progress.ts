import { BudgetWithCategory, BudgetProgress, resolveBudgetScope } from '../domain/budget.model';
import { IBudgetRepository } from '../repositories/budget.repository';
import { calculateBudgetUsage, enrichBudgetProgress } from '@/modules/reports/services/financial-calculations';

export class CalculateBudgetProgressUseCase {
  constructor(private repository: IBudgetRepository) {}

  async execute(budget: BudgetWithCategory, startDate: number, endDate: number): Promise<BudgetProgress | null> {
    if (!budget.amount || !budget.period) return null;

    const scope = resolveBudgetScope(budget);
    let spent_amount: number;

    if (scope.type === 'wallet') {
      spent_amount = await this.repository.getSpentAmount(
        budget.category_id, startDate, endDate, scope.walletId
      );
    } else if (scope.type === 'account_type') {
      spent_amount = await this.repository.getSpentAmountByAccountType(
        budget.category_id, startDate, endDate, scope.accountType
      );
    } else {
      // global: tính tất cả ví
      spent_amount = await this.repository.getSpentAmount(
        budget.category_id, startDate, endDate
      );
    }

    const offset_amount = await this.repository.getOffsetAmount(
      budget.id, startDate, endDate
    );

    const usage = calculateBudgetUsage({
      budget,
      spentAmount: spent_amount,
      offsetAmount: offset_amount,
      range: { startDate, endDate },
    });

    return enrichBudgetProgress(budget, usage);
  }
}
