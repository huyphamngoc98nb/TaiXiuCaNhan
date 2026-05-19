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

    // getById now only returns active records (deleted_at IS NULL)
    const oldTransaction = await this.repository.getById(id);
    if (!oldTransaction) throw new Error('Transaction not found');

    const wallet = await this.walletRepository.getById(oldTransaction.wallet_id);
    if (!wallet) throw new Error('Wallet not found');

    const finalType = input.type ?? oldTransaction.type;
    const finalAmount = input.amount ?? oldTransaction.amount;
    const finalToWalletId = finalType === 'transfer'
      ? input.to_wallet_id ?? oldTransaction.to_wallet_id
      : null;

    if (finalType === 'transfer') {
      if (!finalToWalletId) {
        throw new TransactionValidationError(['to_wallet_id is required for transfer transactions']);
      }
      if (finalToWalletId === oldTransaction.wallet_id) {
        throw new TransactionValidationError(['to_wallet_id must be different from wallet_id']);
      }
      const toWallet = await this.walletRepository.getById(finalToWalletId);
      if (!toWallet) throw new Error('Destination wallet not found');
    }

    // BUG-4 fix: tính net delta rồi kiểm tra balance không âm trước khi write
    // delta dương = nhận tiền vào wallet, âm = mất tiền khỏi wallet
    let delta = 0;

    // 1. Revert ảnh hưởng cũ
    if (oldTransaction.type === 'income') delta -= oldTransaction.amount;
    else if (oldTransaction.type === 'expense' || oldTransaction.type === 'transfer')
      delta += oldTransaction.amount;

    // 2. Áp dụng ảnh hưởng mới
    if (finalType === 'income') delta += finalAmount;
    else if (finalType === 'expense' || finalType === 'transfer') delta -= finalAmount;

    // 3. Kiểm tra số dư sau khi áp delta: phải >= 0
    const projectedBalance = wallet.balance + delta;
    if (projectedBalance < 0) {
      throw new TransactionValidationError([
        `Insufficient balance: current ${wallet.balance}, required additional ${Math.abs(delta)}`,
      ]);
    }

    const destinationDeltas = new Map<string, number>();
    if (oldTransaction.type === 'transfer' && oldTransaction.to_wallet_id) {
      destinationDeltas.set(
        oldTransaction.to_wallet_id,
        (destinationDeltas.get(oldTransaction.to_wallet_id) ?? 0) - oldTransaction.amount,
      );
    }
    if (finalType === 'transfer' && finalToWalletId) {
      destinationDeltas.set(
        finalToWalletId,
        (destinationDeltas.get(finalToWalletId) ?? 0) + finalAmount,
      );
    }

    let newSavedReceiptPath: string | undefined;
    if (newReceiptBase64) {
      newSavedReceiptPath = await ReceiptStorageService.saveReceipt(newReceiptBase64);
    }

    const now = Date.now();

    // Resolve the final receipt_path that will be stored
    // Priority: new base64-saved path > explicit input.receipt_path > keep old
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
          // Atomic delta update — no race condition
          await this.walletRepository.updateBalanceDelta(oldTransaction.wallet_id, delta, now);
          for (const [walletId, walletDelta] of destinationDeltas) {
            if (walletDelta !== 0) {
              await this.walletRepository.updateBalanceDelta(walletId, walletDelta, now);
            }
          }
        }

        return result;
      });

      // Persist web store after successful commit
      const isWeb = Capacitor.getPlatform() === 'web';
      if (isWeb) {
        const { sqlite } = await import('@/core/db/sqlite/pragmas');
        await sqlite.saveToStore(DB_NAME);
      }

      // Bug #6 fix: delete old receipt whenever receipt path actually changes
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
      // Cleanup new orphaned receipt on DB failure
      if (newSavedReceiptPath) {
        await ReceiptStorageService.deleteReceipt(newSavedReceiptPath);
      }
      throw error;
    }
  }
}
