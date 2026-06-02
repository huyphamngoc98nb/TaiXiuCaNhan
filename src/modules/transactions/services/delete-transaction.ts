import { ITransactionRepository } from '../repositories/transaction.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import { DB_NAME } from '@/core/db/sqlite/connection';
import { sqliteTransactionRunner, TransactionRunner } from '@/core/db/transaction-runner';
import { Capacitor } from '@capacitor/core';

export class DeleteTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private walletRepository: IWalletRepository = appRepositories.wallet,
    private runTransaction: TransactionRunner = sqliteTransactionRunner
  ) {}

  async execute(id: string) {
    let didMutate = false;

    await this.runTransaction(async () => {
      // Read include-deleted inside serialized work so repeated delete calls
      // return success without applying balance deltas more than once.
      const transaction = await this.repository.getByIdIncludeDeleted(id);
      if (!transaction) throw new Error('Transaction not found');
      if (transaction.deleted_at !== null) return true;

      const wallet = await this.walletRepository.getById(transaction.wallet_id);
      if (!wallet) throw new Error('Wallet not found');

      const destinationWallet = transaction.type === 'transfer' && transaction.to_wallet_id
        ? await this.walletRepository.getById(transaction.to_wallet_id)
        : null;
      const shouldRevertDestinationWallet = destinationWallet !== null;
      const now = Date.now();

      // Compute source wallet revert delta.
      let sourceDelta = 0;
      if (transaction.type === 'income') sourceDelta = -transaction.amount;
      else if (transaction.type === 'expense' || transaction.type === 'transfer') {
        sourceDelta = transaction.amount;
      }

      await this.repository.softDelete(id, now);

      // Atomic delta update: no race condition.
      await this.walletRepository.updateBalanceDelta(transaction.wallet_id, sourceDelta, now);

      // If the destination wallet was physically removed, there is no balance
      // row left to reconcile. Soft-delete still removes the active ledger
      // entry, and the source wallet revert is the only valid remaining delta.
      if (transaction.type === 'transfer' && transaction.to_wallet_id && shouldRevertDestinationWallet) {
        await this.walletRepository.updateBalanceDelta(transaction.to_wallet_id, -transaction.amount, now);
      }

      didMutate = true;
      return true;
    });

    // Persist web store after successful commit.
    if (didMutate && Capacitor.getPlatform() === 'web') {
      const { sqlite } = await import('@/core/db/sqlite/pragmas');
      await sqlite.saveToStore(DB_NAME);
    }

    return true;
  }
}
