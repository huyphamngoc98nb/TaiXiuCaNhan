import { describe, it, expect, vi } from 'vitest';
import { BuildExportDatasetUseCase } from '@/modules/export/services/build-export-dataset';
import { exportToCsv } from '@/modules/export/services/export-excel';

describe('Export Module Tests', () => {
  describe('BuildExportDatasetUseCase', () => {
    it('aggregates data correctly from multiple repositories', async () => {
      const mockReportRepo: any = {
        getCashflowSummary: vi.fn().mockResolvedValue({ totalIncome: 100, totalExpense: 50, netAmount: 50 }),
        getCategorySummary: vi.fn().mockResolvedValue([]),
        getPeriodSummary: vi.fn().mockResolvedValue([]),
      };
      const mockTransactionRepo: any = {
        list: vi.fn().mockResolvedValue([{ id: '1', amount: 10, type: 'expense' }]),
      };

      const useCase = new BuildExportDatasetUseCase(mockReportRepo, mockTransactionRepo);
      const range = { startDate: 0, endDate: 1000 };
      const result = await useCase.execute(range);

      expect(result.cashflow.totalIncome).toBe(100);
      expect(result.rawTransactions).toHaveLength(1);
      expect(mockReportRepo.getCashflowSummary).toHaveBeenCalledWith(range);
    });
  });

  describe('CSV Export Logic', () => {
    it('generates a valid CSV string with headers and escaped notes', () => {
      const dataset: any = {
        rawTransactions: [
          {
            transaction_date: new Date('2024-01-01').getTime(),
            wallet_name: 'Cash',
            category_name: 'Food',
            type: 'expense',
            amount: 15.5,
            note: 'Pizza "night"'
          }
        ]
      };

      const csv = exportToCsv(dataset);
      const lines = csv.split('\n');

      expect(lines[0]).toBe('Date,Wallet,Category,Type,Amount,Note');
      expect(lines[1]).toContain('2024-01-01');
      expect(lines[1]).toContain('Food');
      expect(lines[1]).toContain('"Pizza ""night"""');
    });

    it('handles empty datasets gracefully', () => {
      const dataset: any = { rawTransactions: [] };
      const csv = exportToCsv(dataset);
      expect(csv).toBe('Date,Wallet,Category,Type,Amount,Note');
    });
  });
});
