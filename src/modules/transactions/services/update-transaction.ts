import { UpdateTransactionInput } from '../domain/transaction.model';
import { validateUpdateTransaction, TransactionValidationError } from '../domain/transaction.schema';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import { IWalletRepository, Wallet } from '@/modules/wallets/repositories/wallet.repository';
import { DB_NAME } from '@/core/db/sqlite/connection';
import { sqliteTransactionRunner, TransactionRunner } from '@/core/db/transaction-runner';
import { ReceiptStorageService } from '@/core/files/receipt-storage';
import { Capacitor } from '@capacitor/core';
import {
  assertActiveWallet,
  assertNoCreditCardToCreditCardTransfer,
  assertProjectedWalletDelta,
  buildUpdateTransactionBalanceDeltas,
} from './transaction-wallet-rules';

export class UpdateTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private walletRepository: IWalletRepository = appRepositories.wallet,
    private runTransaction: TransactionRunner = sqliteTransactionRunner
  ) {}

  async execute(id: string, input: UpdateTransactionInput, newReceiptBase64?: string) {
    validateUpdateTransaction(input);

    // Avoid orphaning a newly uploaded receipt; transaction state is read again below.
    if (!await this.repository.getById(id)) throw new Error('Transaction not found');

    let newSavedReceiptPath: string | undefined;
    if (newReceiptBase64) {
      newSavedReceiptPath = await ReceiptStorageService.saveReceipt(newReceiptBase64);
    }

    const now = Date.now();
    const finalReceiptPath = newSavedReceiptPath ?? input.receipt_path;
    let previousReceiptPath: string | null = null;

    try {
      const updated = await this.runTransaction(async () => {
        const oldTransaction = await this.repository.getById(id);
        if (!oldTransaction) throw new Error('Transaction not found');
        previousReceiptPath = oldTransaction.receipt_path;

        const finalType = input.type ?? oldTransaction.type;
        const finalAmount = input.amount ?? oldTransaction.amount;
        const finalWalletId = input.wallet_id ?? oldTransaction.wallet_id;
        const finalToWalletId = finalType === 'transfer'
          ? input.to_wallet_id ?? oldTransaction.to_wallet_id
          : null;

        const finalWallet = await this.walletRepository.getById(finalWalletId);
        if (!finalWallet) throw new Error('Wallet not found');
        assertActiveWallet(finalWallet, 'Wallet is inactive');

        const walletsById = new Map<string, Wallet>([[finalWallet.id, finalWallet]]);
        if (finalType === 'transfer') {
          if (!finalToWalletId) {
            throw new TransactionValidationError(['to_wallet_id is required for transfer transactions']);
          }
          if (finalToWalletId === finalWalletId) {
            throw new TransactionValidationError(['to_wallet_id must be different from wallet_id']);
          }
          const finalToWallet = await this.walletRepository.getById(finalToWalletId);
          if (!finalToWallet) throw new Error('Destination wallet not found');
          assertActiveWallet(finalToWallet, 'Destination wallet is inactive');
          assertNoCreditCardToCreditCardTransfer(finalWallet, finalToWallet);
          walletsById.set(finalToWallet.id, finalToWallet);
        }

        const balanceDeltas = buildUpdateTransactionBalanceDeltas(
          oldTransaction,
          finalType,
          finalAmount,
          finalWalletId,
          finalToWalletId,
        );

        for (const [walletId, walletDelta] of balanceDeltas) {
          if (walletDelta === 0) continue;
          let wallet: Wallet | undefined = walletsById.get(walletId);
          if (!wallet) {
            const loadedWallet = await this.walletRepository.getById(walletId);
            if (!loadedWallet) throw new Error('Wallet not found');
            wallet = loadedWallet;
            walletsById.set(wallet.id, wallet);
          }
          assertProjectedWalletDelta(wallet, walletDelta);
        }

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
        previousReceiptPath &&
        finalReceiptPath !== previousReceiptPath
      ) {
        await ReceiptStorageService.deleteReceipt(previousReceiptPath);
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
