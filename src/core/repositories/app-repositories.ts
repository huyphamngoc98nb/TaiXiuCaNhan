import type { IBudgetRepository } from '@/modules/budgets/repositories/budget.repository';
import { SQLiteBudgetRepository } from '@/modules/budgets/repositories/sqlite-budget.repository';
import { SQLiteCategoryRepository } from '@/modules/categories/repositories/sqlite-category.repository';
import type { ILoanRepository } from '@/modules/loans/repositories/loan.repository';
import { SQLiteLoanRepository } from '@/modules/loans/repositories/sqlite-loan.repository';
import type { IRecurringBillRepository } from '@/modules/recurring-bills/repositories/recurring-bill.repository';
import { SQLiteRecurringBillRepository } from '@/modules/recurring-bills/repositories/sqlite-recurring-bill.repository';
import type { IReportRepository } from '@/modules/reports/repositories/report.repository';
import { SQLiteReportRepository } from '@/modules/reports/repositories/sqlite-report.repository';
import type { ITransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import { SQLiteTransactionRepository } from '@/modules/transactions/repositories/sqlite-transaction.repository';
import type { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import { SQLiteWalletRepository } from '@/modules/wallets/repositories/sqlite-wallet.repository';

export interface AppRepositories {
  budget: IBudgetRepository;
  category: SQLiteCategoryRepository;
  loan: ILoanRepository;
  recurringBill: IRecurringBillRepository;
  report: IReportRepository;
  transaction: ITransactionRepository;
  wallet: IWalletRepository;
}

export function createSQLiteRepositories(): AppRepositories {
  return {
    budget: new SQLiteBudgetRepository(),
    category: new SQLiteCategoryRepository(),
    loan: new SQLiteLoanRepository(),
    recurringBill: new SQLiteRecurringBillRepository(),
    report: new SQLiteReportRepository(),
    transaction: new SQLiteTransactionRepository(),
    wallet: new SQLiteWalletRepository(),
  };
}

export const appRepositories = createSQLiteRepositories();
