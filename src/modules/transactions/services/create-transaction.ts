import { CreateTransactionInput } from '../domain/transaction.model';
import { validateCreateTransaction, TransactionValidationError } from '../domain/transaction.schema';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import { IWalletRepository, Wallet } from '@/modules/wallets/repositories/wallet.repository';
import { DB_NAME } from '@/core/db/sqlite/connection';
import { sqliteTransactionRunner, TransactionRunner } from '@/core/db/transaction-runner';
import { ReceiptStorageService } from '@/core/files/receipt-storage';
import { Capacitor } from '@capacitor/core';

function getSourceDelta(type: CreateTransactionInput['type'], amount: number): number {
  if (type === 'income') return amount;
  return -amount;
}

function validateActiveWallet(wallet: Wallet, message: string) {
  if (wallet.is_active !== 1) throw new Error(message);
}

export class CreateTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private walletRepository: IWalletRepository = appRepositories.wallet,
    private runTransaction: TransactionRunner = sqliteTransactionRunner
  ) {}

  async execute(input: CreateTransactionInput, receiptBase64?: string) {
    validateCreateTransaction(input);

    const wallet = await this.walletRepository.getById(input.wallet_id);
    if (!wallet) throw new Error('Wallet not found');
    validateActiveWallet(wallet, 'Wallet is inactive');

    let toWallet: Wallet | null = null;
    if (input.type === 'transfer') {
      toWallet = input.to_wallet_id
        ? await this.walletRepository.getById(input.to_wallet_id)
        : null;
      if (!toWallet) throw new Error('Destination wallet not found');
      validateActiveWallet(toWallet, 'Destination wallet is inactive');
      if (toWallet.account_type === 'credit_card' && wallet.account_type === 'credit_card') {
        throw new TransactionValidationError([
          'Credit card payment source must be a cash, bank, or e-wallet account',
        ]);
      }
    }

    const isCreditCardExpense =
      input.type === 'expense' && wallet.account_type === 'credit_card';
    if (
      (input.type === 'expense' || input.type === 'transfer') &&
      !isCreditCardExpense &&
      wallet.balance < input.amount
    ) {
      throw new TransactionValidationError([
        `Insufficient balance: available ${wallet.balance}, required ${input.amount}`,
      ]);
    }
    if (
      isCreditCardExpense &&
      wallet.credit_limit != null &&
      wallet.credit_limit + wallet.balance < input.amount
    ) {
      throw new TransactionValidationError([
        `Insufficient credit: available ${wallet.credit_limit + wallet.balance}, required ${input.amount}`,
      ]);
    }

    let savedReceiptPath: string | undefined;
    if (receiptBase64) {
      savedReceiptPath = await ReceiptStorageService.saveReceipt(receiptBase64);
    }

    const now = Date.now();
    const id = crypto.randomUUID();
    const sourceDelta = getSourceDelta(input.type, input.amount);

    try {
      const transaction = await this.runTransaction(async () => {
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
