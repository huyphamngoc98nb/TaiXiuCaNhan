import { UpdateTransactionInput } from '../domain/transaction.model';
import { validateUpdateTransaction, TransactionValidationError } from '../domain/transaction.schema';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import { DB_NAME } from '@/core/db/sqlite/connection';
import { sqliteTransactionRunner, TransactionRunner } from '@/core/db/transaction-runner';
import { ReceiptStorageService } from '@/core/files/receipt-storage';
import { Capacitor } from '@capacitor/core';

export class UpdateTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private walletRepository: IWalletRepository = appRepositories.wallet,
    private runTransaction: TransactionRunner = sqliteTransactionRunner
  ) {}

  async execute(id: string, input: UpdateTransactionInput, newReceiptBase64?: string) {
    validateUpdateTransaction(input);

    const oldTransaction = await this.repository.getById(id);
    if (!oldTransaction) throw new Error('Transaction not found');

    const finalType = input.type ?? oldTransaction.type;
    const finalAmount = input.amount ?? oldTransaction.amount;
    const finalWalletId = input.wallet_id ?? oldTransaction.wallet_id;
    const finalToWalletId = finalType === 'transfer'
      ? input.to_wallet_id ?? oldTransaction.to_wallet_id
      : null;

    const finalWallet = await this.walletRepository.getById(finalWalletId);
    if (!finalWallet) throw new Error('Wallet not found');
    if (finalWallet.is_active !== 1) throw new Error('Wallet is inactive');

    let finalToWallet = null;
    if (finalType === 'transfer') {
      if (!finalToWalletId) {
        throw new TransactionValidationError(['to_wallet_id is required for transfer transactions']);
      }
      if (finalToWalletId === finalWalletId) {
        throw new TransactionValidationError(['to_wallet_id must be different from wallet_id']);
      }
      finalToWallet = await this.walletRepository.getById(finalToWalletId);
      if (!finalToWallet) throw new Error('Destination wallet not found');
      if (finalToWallet.is_active !== 1) throw new Error('Destination wallet is inactive');
      if (
        finalToWallet.account_type === 'credit_card' &&
        finalWallet.account_type === 'credit_card'
      ) {
        throw new TransactionValidationError([
          'Credit card payment source must be a cash, bank, or e-wallet account',
        ]);
      }
    }

    const balanceDeltas = new Map<string, number>();
    const addDelta = (walletId: string, delta: number) => {
      balanceDeltas.set(walletId, (balanceDeltas.get(walletId) ?? 0) + delta);
    };

    // Revert the old source-wallet effect.
    if (oldTransaction.type === 'income') {
      addDelta(oldTransaction.wallet_id, -oldTransaction.amount);
    } else if (oldTransaction.type === 'expense' || oldTransaction.type === 'transfer') {
      addDelta(oldTransaction.wallet_id, oldTransaction.amount);
    }

    // Apply the new source-wallet effect. This may target a different wallet.
    if (finalType === 'income') {
      addDelta(finalWalletId, finalAmount);
    } else if (finalType === 'expense' || finalType === 'transfer') {
      addDelta(finalWalletId, -finalAmount);
    }

    // Revert/apply destination-wallet effects for transfers.
    if (oldTransaction.type === 'transfer' && oldTransaction.to_wallet_id) {
      addDelta(oldTransaction.to_wallet_id, -oldTransaction.amount);
    }
    if (finalType === 'transfer' && finalToWalletId) {
      addDelta(finalToWalletId, finalAmount);
    }

    for (const [walletId, walletDelta] of balanceDeltas) {
      if (walletDelta === 0) continue;
      const wallet = await this.walletRepository.getById(walletId);
      if (!wallet) throw new Error('Wallet not found');

      const projectedBalance = wallet.balance + walletDelta;
      if (wallet.account_type === 'credit_card') {
        const projectedOutstanding = Math.max(0, -projectedBalance);
        if (wallet.credit_limit != null && projectedOutstanding > wallet.credit_limit) {
          throw new TransactionValidationError([
            `Insufficient credit: available ${wallet.credit_limit + wallet.balance}, required additional ${Math.abs(walletDelta)}`,
          ]);
        }
        continue;
      }
      if (projectedBalance < 0) {
        throw new TransactionValidationError([
          `Insufficient balance: current ${wallet.balance}, required additional ${Math.abs(walletDelta)}`,
        ]);
      }
    }

    let newSavedReceiptPath: string | undefined;
    if (newReceiptBase64) {
      newSavedReceiptPath = await ReceiptStorageService.saveReceipt(newReceiptBase64);
    }

    const now = Date.now();
    const finalReceiptPath = newSavedReceiptPath ?? input.receipt_path;

    try {
      const updated = await this.runTransaction(async () => {
        const result = await this.repository.update(id, {
          ...input,
          to_wallet_id: finalToWalletId,
          ...(finalReceiptPath !== undefined ? { receipt_path: finalReceiptPath } : {}),
          updated_at: now,
        });

        if (result) {
          for (const [walletId, walletDelta] of balanceDeltas) {
            if (walletDelta !== 0) {
              await this.walletRepository.updateBalanceDelta(walletId, walletDelta, now);
            }
          }
        }

        return result;
      });

      const isWeb = Capacitor.getPlatform() === 'web';
      if (isWeb) {
        const { sqlite } = await import('@/core/db/sqlite/pragmas');
        await sqlite.saveToStore(DB_NAME);
      }

      if (
        updated &&
        finalReceiptPath &&
        oldTransaction.receipt_path &&
        finalReceiptPath !== oldTransaction.receipt_path
      ) {
        await ReceiptStorageService.deleteReceipt(oldTransaction.receipt_path);
      }

      return updated;
    } catch (error) {
      if (newSavedReceiptPath) {
        await ReceiptStorageService.deleteReceipt(newSavedReceiptPath);
      }
      throw error;
    }
  }
}
