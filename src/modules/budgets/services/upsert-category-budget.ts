import { BudgetPeriod, BudgetWithCategory, CreateBudgetDto } from '../domain/budget.model';
import { IBudgetRepository } from '../repositories/budget.repository';
import { Capacitor } from '@capacitor/core';

export class UpsertCategoryBudgetUseCase {
  constructor(private repository: IBudgetRepository) {}

  /**
   * @param categoryId - category cần đặt ngân sách
   * @param amount     - số tiền; null = xoá ngân sách
   * @param period     - 'weekly' | 'monthly'; null = xoá ngân sách
   * @param walletId   - tuỳ chọn scope theo ví; undefined/null = áp dụng mọi ví
   */
  async execute(
    categoryId: string,
    amount: number | null,
    period: BudgetPeriod | null,
    walletId?: string | null
  ): Promise<void> {
    if (amount !== null && amount <= 0) {
      throw new Error('Budget amount must be greater than 0');
    }

    if ((amount === null) !== (period === null)) {
      throw new Error(
        'Both amount and period must be provided, or both must be null to clear the budget'
      );
    }

    if (amount === null || period === null) {
      // Xoá ngân sách: deactivate tất cả budget active của category này
      // BUG FIX #10: trước đây gọi getActiveBudgets 2 lần rồi filter —
      //   nếu wallet_id khác nhau sẽ bỏ sót. Dùng getActiveBudgets(period, undefined)
      //   để lấy tất cả rồi lọc theo category_id + wallet scope.
      const [monthlyBudgets, weeklyBudgets]: [BudgetWithCategory[], BudgetWithCategory[]] =
        await Promise.all([
          this.repository.getActiveBudgets('monthly', walletId ?? undefined),
          this.repository.getActiveBudgets('weekly', walletId ?? undefined),
        ]);

      const toDeactivate = [...monthlyBudgets, ...weeklyBudgets].filter(
        b => b.category_id === categoryId
      );

      if (toDeactivate.length === 0) {
        // Không có budget nào active — không throw, chỉ log
        return;
      }

      await Promise.all(toDeactivate.map(b => this.repository.deactivateBudget(b.id)));
    } else {
      const dto: CreateBudgetDto = {
        category_id: categoryId,
        wallet_id: walletId ?? null,
        amount,
        period,
        start_date: this._getPeriodStart(period),
      };
      await this.repository.upsertBudget(dto);
    }

    const isWeb = Capacitor.getPlatform() === 'web';
    if (isWeb) {
      const { sqlite } = await import('@/core/db/sqlite/pragmas');
      const { DB_NAME } = await import('@/core/db/sqlite/connection');
      await sqlite.saveToStore(DB_NAME);
    }
  }

  private _getPeriodStart(period: BudgetPeriod): number {
    const now = new Date();
    if (period === 'monthly') {
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    }
    // weekly: lấy thứ Hai đầu tuần (ISO week)
    const day = now.getDay(); // 0 = Sun
    const diff = day === 0 ? -6 : 1 - day;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff).getTime();
  }
}
