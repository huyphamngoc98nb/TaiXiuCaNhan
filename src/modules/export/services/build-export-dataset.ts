import { DateRange, CashflowSummary, CategorySummary, PeriodSummary } from '@/modules/reports/domain/report.model';
import { IReportRepository } from '@/modules/reports/repositories/report.repository';
import { ITransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import { Transaction } from '@/modules/transactions/domain/transaction.model';

export interface ExportDataset {
  range: DateRange;
  cashflow: CashflowSummary;
  expensesByCategory: CategorySummary[];
  incomeByCategory: CategorySummary[];
  periodSummary: PeriodSummary[];
  rawTransactions: Transaction[];
}

export class BuildExportDatasetUseCase {
  constructor(
    private reportRepo: IReportRepository,
    private transactionRepo: ITransactionRepository
  ) {}

  async execute(range: DateRange): Promise<ExportDataset> {
    const [cashflow, expenses, income, periods, transactions] = await Promise.all([
      this.reportRepo.getCashflowSummary(range),
      this.reportRepo.getCategorySummary(range, 'expense'),
      this.reportRepo.getCategorySummary(range, 'income'),
      this.reportRepo.getPeriodSummary(range, 'day'),
      this.transactionRepo.list({ 
        startDate: range.startDate, 
        endDate: range.endDate 
      })
    ]);

    return {
      range,
      cashflow,
      expensesByCategory: expenses,
      incomeByCategory: income,
      periodSummary: periods,
      rawTransactions: transactions
    };
  }
}
