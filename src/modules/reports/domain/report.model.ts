export interface DateRange {
  startDate: number; // Unix timestamp in milliseconds
  endDate: number;   // Unix timestamp in milliseconds
}

export type ReportGranularity = 'day' | 'week' | 'month';

export interface CategorySummary {
  category_id: string;
  category_name: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface WalletSummary {
  wallet_id: string;
  wallet_name: string;
  amount: number;
}

export interface PeriodSummary {
  period: string; // Format depends on granularity ('YYYY-MM-DD', 'YYYY-Wxx', or 'YYYY-MM')
  income: number;
  expense: number;
}

export interface CashflowSummary {
  grossIncome: number;
  grossExpense: number;
  totalOffset: number;
  netExpense: number;
  // Backward-compatible aliases used by existing report, forecast, and export consumers.
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}
