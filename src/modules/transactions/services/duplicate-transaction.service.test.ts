import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDbConnection } from '@/core/db/sqlite/connection';
import { findDuplicateTransaction } from './duplicate-transaction.service';

vi.mock('@/core/db/sqlite/connection', () => ({
  getDbConnection: vi.fn(),
}));

interface TransactionRow {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  wallet_id: string;
  category_id: string;
  transaction_date: number;
  deleted_at: number | null;
}

function mockTransactions(rows: TransactionRow[]) {
  vi.mocked(getDbConnection).mockResolvedValue({
    query: vi.fn(async (_sql: string, params: unknown[]) => {
      const [
        type,
        amount,
        walletId,
        categoryId,
        startDate,
        endDate,
        excludeTransactionId,
      ] = params;
      const duplicate = rows.find((row) => (
        row.deleted_at === null &&
        row.type === type &&
        row.amount === amount &&
        row.wallet_id === walletId &&
        row.category_id === categoryId &&
        row.transaction_date >= Number(startDate) &&
        row.transaction_date <= Number(endDate) &&
        row.id !== excludeTransactionId
      ));

      return { values: duplicate ? [{ id: duplicate.id }] : [] };
    }),
  } as never);
}

describe('findDuplicateTransaction', () => {
  const transactionDate = new Date('2026-06-22T10:30:00').getTime();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTransactions([]);
  });

  it('returns null when no duplicate exists', async () => {
    await expect(findDuplicateTransaction({
      type: 'expense',
      amount: 100_000,
      walletId: 'wallet-1',
      categoryId: 'cat-food',
      transactionDate,
    })).resolves.toBeNull();
  });

  it('returns the duplicate id for a matching transaction on the same local day', async () => {
    mockTransactions([
      {
        id: 'tx-duplicate',
        type: 'expense',
        amount: 100_000,
        wallet_id: 'wallet-1',
        category_id: 'cat-food',
        transaction_date: new Date('2026-06-22T23:59:00').getTime(),
        deleted_at: null,
      },
    ]);

    await expect(findDuplicateTransaction({
      type: 'expense',
      amount: 100_000,
      walletId: 'wallet-1',
      categoryId: 'cat-food',
      transactionDate,
    })).resolves.toEqual({ id: 'tx-duplicate' });
  });

  it('does not count soft-deleted transactions', async () => {
    mockTransactions([
      {
        id: 'tx-deleted',
        type: 'expense',
        amount: 100_000,
        wallet_id: 'wallet-1',
        category_id: 'cat-food',
        transaction_date: transactionDate,
        deleted_at: Date.now(),
      },
    ]);

    await expect(findDuplicateTransaction({
      type: 'expense',
      amount: 100_000,
      walletId: 'wallet-1',
      categoryId: 'cat-food',
      transactionDate,
    })).resolves.toBeNull();
  });

  it('excludes the provided transaction id', async () => {
    mockTransactions([
      {
        id: 'tx-current',
        type: 'expense',
        amount: 100_000,
        wallet_id: 'wallet-1',
        category_id: 'cat-food',
        transaction_date: transactionDate,
        deleted_at: null,
      },
    ]);

    await expect(findDuplicateTransaction({
      type: 'expense',
      amount: 100_000,
      walletId: 'wallet-1',
      categoryId: 'cat-food',
      transactionDate,
      excludeTransactionId: 'tx-current',
    })).resolves.toBeNull();
  });
});
