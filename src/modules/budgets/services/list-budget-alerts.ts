import { BudgetProgress, BudgetPeriod } from '../domain/budget.model';
import { IBudgetRepository } from '../repositories/budget.repository';
import { CalculateBudgetProgressUseCase } from './calculate-budget-progress';
import { buildDateRange } from '@/modules/reports/services/build-date-range';

export class ListBudgetAlertsUseCase {
  private calculateProgress: CalculateBudgetProgressUseCase;

  constructor(private repository: IBudgetRepository) {
    this.calculateProgress = new CalculateBudgetProgressUseCase(repository);
  }

  /**
   * WARN-1 fix: thay thế for-loop tuần tự bằng Promise.all — giảm từ N round-trips
   * xuống còn 3 queries (weekly, monthly, rồi parallel getSpentAmount).
   *
   * @param walletId - tuỳ chọn scope theo ví; undefined = tất cả ví
   */
  async execute(walletId?: string): Promise<BudgetProgress[]> {
    // Lấy cả weekly + monthly song song
    const [weekly, monthly] = await Promise.all([
      this.repository.getActiveBudgets('weekly' as BudgetPeriod, walletId),
      this.repository.getActiveBudgets('monthly' as BudgetPeriod, walletId),
    ]);

    const allBudgets = [...weekly, ...monthly];

    // Tính progress song song cho tất cả budget
    const progressList: BudgetProgress[] = await Promise.all(
      allBudgets.map(budget => {
        const rangeKey = budget.period === 'weekly' ? 'this_week' : 'this_month';
        const range = buildDateRange(rangeKey);
        return this.calculateProgress.execute(budget, range.startDate, range.endDate);
      })
    );

    // Sắp xếp giảm dần theo % (vượt ngân sách lên đầu)
    return progressList.sort((a, b) => b.percentage - a.percentage);
  }
}
