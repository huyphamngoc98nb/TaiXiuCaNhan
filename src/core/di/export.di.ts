import { SQLiteReportRepository } from '@/modules/reports/repositories/sqlite-report.repository';
import { SQLiteTransactionRepository } from '@/modules/transactions/repositories/sqlite-transaction.repository';
import { BuildExportDatasetUseCase } from '@/modules/export/services/build-export-dataset';

const reportRepo = new SQLiteReportRepository();
const transactionRepo = new SQLiteTransactionRepository();

export const buildExportDatasetUseCase = new BuildExportDatasetUseCase(reportRepo, transactionRepo);
