import type { CreateTransactionInput, Transaction } from '../domain/transaction.model';
import type { ITransactionRepository } from '../repositories/transaction.repository';

type SourcedTransactionCreate = CreateTransactionInput & {
  id: string;
  created_at: number;
  updated_at: number;
  source_type: string;
  source_id: string;
  source_event: string;
};

export interface IdempotentTransactionResult {
  transaction: Transaction;
  created: boolean;
}

export function isSourceUniqueConstraintConflict(error: unknown): boolean {
  const message = String(error instanceof Error ? error.message : error).toLowerCase();
  return message.includes('unique constraint failed') &&
    message.includes('transactions.source_type') &&
    message.includes('transactions.source_id') &&
    message.includes('transactions.source_event');
}

export async function createIdempotentSourceTransaction(
  repository: ITransactionRepository,
  data: SourcedTransactionCreate
): Promise<IdempotentTransactionResult> {
  const existing = await repository.getBySource(
    data.source_type,
    data.source_id,
    data.source_event
  );
  if (existing) return { transaction: existing, created: false };

  try {
    return { transaction: await repository.create(data), created: true };
  } catch (error) {
    if (!isSourceUniqueConstraintConflict(error)) throw error;

    const winner = await repository.getBySource(
      data.source_type,
      data.source_id,
      data.source_event
    );
    if (!winner) throw error;
    return { transaction: winner, created: false };
  }
}
