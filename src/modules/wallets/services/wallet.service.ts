import { Capacitor } from '@capacitor/core';
import type {
  Wallet,
  CreateWalletInput,
  UpdateWalletInput,
} from '../repositories/wallet.repository';
import { appRepositories } from '@/core/repositories/app-repositories';
import type { IWalletRepository } from '../repositories/wallet.repository';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function assertCreditCardSettings(data: CreateWalletInput | UpdateWalletInput): void {
  if (data.account_type !== 'credit_card') return;
  if (data.credit_limit !== undefined && (!data.credit_limit || data.credit_limit <= 0)) {
    throw new Error('Credit limit must be greater than 0 for credit card accounts.');
  }
  if (
    data.statement_day !== undefined &&
    data.statement_day !== null &&
    (data.statement_day < 1 || data.statement_day > 31)
  ) {
    throw new Error('Statement day must be between 1 and 31.');
  }
  if (
    data.due_day !== undefined &&
    data.due_day !== null &&
    (data.due_day < 1 || data.due_day > 31)
  ) {
    throw new Error('Due day must be between 1 and 31.');
  }
  if (data.annual_fee !== undefined && data.annual_fee !== null && data.annual_fee < 0) {
    throw new Error('Annual fee cannot be negative.');
  }
}

async function persistWeb(): Promise<void> {
  if (Capacitor.getPlatform() === 'web') {
    const { sqlite } = await import('@/core/db/sqlite/pragmas');
    const { DB_NAME } = await import('@/core/db/sqlite/connection');
    await sqlite.saveToStore(DB_NAME);
  }
}

export class WalletService {
  constructor(private readonly repo: IWalletRepository = appRepositories.wallet) {}

  async createWallet(data: CreateWalletInput): Promise<Wallet> {
    if (!data.name.trim()) {
      throw new Error('Wallet name is required.');
    }
    if (data.account_type === 'credit_card' && (!data.credit_limit || data.credit_limit <= 0)) {
      throw new Error('Credit limit must be greater than 0 for credit card accounts.');
    }
    assertCreditCardSettings(data);

    const id = generateId();
    const now = Date.now();
    await this.repo.create(id, data, now);
    await persistWeb();
    const wallet = await this.repo.getById(id);
    if (!wallet) throw new Error('Wallet creation failed: not found after insert.');
    return wallet;
  }

  async updateWallet(id: string, data: UpdateWalletInput): Promise<Wallet> {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('Wallet name is required.');
    }
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error('Wallet not found.');
    const nextAccountType = data.account_type ?? existing.account_type;
    const nextCreditLimit = data.credit_limit ?? existing.credit_limit;
    if (nextAccountType === 'credit_card' && (!nextCreditLimit || nextCreditLimit <= 0)) {
      throw new Error('Credit limit must be greater than 0 for credit card accounts.');
    }
    assertCreditCardSettings(data);

    const now = Date.now();
    await this.repo.update(id, data, now);
    await persistWeb();
    const wallet = await this.repo.getById(id);
    if (!wallet) throw new Error('Wallet not found after update.');
    return wallet;
  }

  async deleteWallet(id: string): Promise<void> {
    const counts = await this.repo.getReferenceCounts(id);
    const totalReferences = counts.transactions + counts.recurringBills + counts.budgets;
    if (totalReferences > 0) {
      throw new Error('Cannot delete a wallet that is used by transactions, bills, or budgets.');
    }

    await this.repo.delete(id);
    await persistWeb();
  }

  /** Net worth = sum of balances for wallets that are not excluded. */
  async getNetWorth(): Promise<number> {
    return this.repo.getTotalBalance();
  }

  async getAllActive(): Promise<Wallet[]> {
    return this.repo.getAllActive();
  }
}
