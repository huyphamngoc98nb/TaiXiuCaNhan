import { CreateTransactionInput } from '../domain/transaction.model';
import { validateCreateTransaction } from '../domain/transaction.schema';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import { DB_NAME } from '@/core/db/sqlite/connection';
import { sqliteTransactionRunner, TransactionRunner } from '@/core/db/transaction-runner';
import { ReceiptStorageService } from '@/core/files/receipt-storage';
import { Capacitor } from '@capacitor/core';
import {
  assertActiveWallet,
  assertCreateTransactionFunding,
  assertNoCreditCardToCreditCardTransfer,
  getSourceDelta,
} from './transaction-wallet-rules';

export class CreateTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private walletRepository: IWalletRepository = appRepositories.wallet,
    private runTransaction: TransactionRunner = sqliteTransactionRunner
  ) {}

  async execute(input: CreateTransactionInput, receiptBase64?: string) {
    validateCreateTransaction(input);

    let savedReceiptPath: string | undefined;
    if (receiptBase64) {
      savedReceiptPath = await ReceiptStorageService.saveReceipt(receiptBase64);
    }

    const now = Date.now();
    const id = crypto.randomUUID();
    const sourceDelta = getSourceDelta(input.type, input.amount);

    try {
      const transaction = await this.runTransaction(async () => {
        const wallet = await this.walletRepository.getById(input.wallet_id);
        if (!wallet) throw new Error('Wallet not found');
        assertActiveWallet(wallet, 'Wallet is inactive');

        if (input.type === 'transfer') {
          const toWallet = input.to_wallet_id
            ? await this.walletRepository.getById(input.to_wallet_id)
            : null;
          if (!toWallet) throw new Error('Destination wallet not found');
          assertActiveWallet(toWallet, 'Destination wallet is inactive');
          assertNoCreditCardToCreditCardTransfer(wallet, toWallet);
        }

        assertCreateTransactionFunding(wallet, input.type, input.amount);

        const tx = await this.repository.create({
          ...input,
          receipt_path: savedReceiptPath || input.receipt_path,
          id,
          created_at: now,
          updated_at: now,
        });

        // For credit cards, negative balance is outstanding liability.
        // Purchases increase it; transfers into the card reduce it.
        await this.walletRepository.updateBalanceDelta(input.wallet_id, sourceDelta, now);

        if (input.type === 'transfer' && input.to_wallet_id) {
          await this.walletRepository.updateBalanceDelta(input.to_wallet_id, input.amount, now);
        }

        return tx;
      });

      if (Capacitor.getPlatform() === 'web') {
        const { sqlite } = await import('@/core/db/sqlite/pragmas');
        await sqlite.saveToStore(DB_NAME);
      }

      return transaction;
    } catch (error) {
      if (savedReceiptPath) {
        await ReceiptStorageService.deleteReceipt(savedReceiptPath);
      }
      throw error;
    }
  }
}
