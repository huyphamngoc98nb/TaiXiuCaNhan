import { getDbConnection } from '@/core/db/sqlite/connection';

export interface DuplicateTransactionCheckInput {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  walletId: string;
  categoryId: string;
  transactionDate: number;
  excludeTransactionId?: string;
}

function getLocalDayBounds(timestamp: number): { start: number; end: number } {
  const date = new Date(timestamp);
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  ).getTime();

  return { start, end };
}

export async function findDuplicateTransaction(
  input: DuplicateTransactionCheckInput
): Promise<{ id: string } | null> {
  const { start, end } = getLocalDayBounds(input.transactionDate);
  const params: Array<string | number> = [
    input.type,
    input.amount,
    input.walletId,
    input.categoryId,
    start,
    end,
  ];
  const excludeClause = input.excludeTransactionId ? ' AND id <> ?' : '';

  if (input.excludeTransactionId) {
    params.push(input.excludeTransactionId);
  }

  const db = await getDbConnection();
  const { values } = await db.query(
    `SELECT id
     FROM transactions
     WHERE deleted_at IS NULL
       AND type = ?
       AND amount = ?
       AND wallet_id = ?
       AND category_id = ?
       AND transaction_date BETWEEN ? AND ?
       ${excludeClause}
     LIMIT 1`,
    params
  );
  const first = values?.[0] as Record<string, unknown> | undefined;

  return typeof first?.id === 'string' ? { id: first.id } : null;
}
