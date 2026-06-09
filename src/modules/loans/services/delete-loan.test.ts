import { describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/modules/transactions/domain/transaction.model';
import type { ITransactionRepository } from '@/modules/transactions/repositories/transaction.repository';
import type { IWalletRepository } from '@/modules/wallets/repositories/wallet.repository';
import type { LoanWithSummary } from '../domain/loan.model';
import type { ILoanRepository } from '../repositories/loan.repository';
import { deleteLoan, LoanHasPaymentsError, type DeleteLoanDeps } from './delete-loan';

vi.mock('@/core/db/transaction-runner', () => ({
  sqliteTransactionRunner: async <T>(work: () => Promise<T>) => work(),
}));

function loan(overrides: Partial<LoanWithSummary> = {}): LoanWithSummary {
  return {
    id: 'loan-1',
    wallet_id: 'wallet-1',
    skip_transaction: false,
    linked_transaction_id: 'transaction-1',
    type: 'lend',
    contact_name: 'Nguyen Van A',
    contact_info: null,
    principal: 1_000_000,
    due_date: null,
    note: null,
    status: 'active',
    created_at: 0,
    updated_at: 0,
    deleted_at: null,
    paid_amount: 0,
    remaining: 1_000_000,
    ...overrides,
  };
}

function linkedTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'transaction-1',
    wallet_id: 'wallet-1',
    category_id: 'cat-cho-vay',
    type: 'expense',
    amount: 1_000_000,
    note: 'Cho vay: Nguyen Van A',
    receipt_path: null,
    to_wallet_id: null,
    transaction_date: 0,
    created_at: 0,
    updated_at: 0,
    deleted_at: null,
    ...overrides,
  };
}

function makeDeps(
  loanOverrides: Partial<ILoanRepository> = {},
  transaction: Transaction | null = linkedTransaction()
): DeleteLoanDeps {
  const loanRepo: ILoanRepository = {
    createLoan: vi.fn(),
    updateLoan: vi.fn(),
    getLoanById: vi.fn(async () => loan()),
    listLoans: vi.fn(async () => []),
    updateLoanStatus: vi.fn(),
    softDeleteLoan: vi.fn(async () => true),
    hardDeleteLoan: vi.fn(async () => true),
    createPayment: vi.fn(),
    listPayments: vi.fn(),
    getTotalPaid: vi.fn(async () => 0),
    ...loanOverrides,
  };
  const transactionRepo: ITransactionRepository = {
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(async () => true),
    getById: vi.fn(),
    getByIdIncludeDeleted: vi.fn(async () => transaction),
    list: vi.fn(),
  };
  const walletRepo = {
    updateBalanceDelta: vi.fn(),
  } as unknown as IWalletRepository;

  return { loanRepo, transactionRepo, walletRepo };
}

describe('deleteLoan', () => {
  it('soft deletes an existing loan', async () => {
    const deps = makeDeps();

    await deleteLoan('loan-1', 'soft', deps);

    expect(deps.loanRepo.softDeleteLoan).toHaveBeenCalledWith('loan-1', expect.any(Number));
    expect(deps.loanRepo.hardDeleteLoan).not.toHaveBeenCalled();
    expect(deps.transactionRepo.softDelete).not.toHaveBeenCalled();
  });

  it('hard deletes an unsettled loan, removes its linked transaction, and refunds the wallet', async () => {
    const deps = makeDeps();

    await deleteLoan('loan-1', 'hard', deps);

    expect(deps.loanRepo.getTotalPaid).toHaveBeenCalledWith('loan-1');
    expect(deps.transactionRepo.getByIdIncludeDeleted).toHaveBeenCalledWith('transaction-1');
    expect(deps.transactionRepo.softDelete).toHaveBeenCalledWith('transaction-1', expect.any(Number));
    expect(deps.walletRepo.updateBalanceDelta).toHaveBeenCalledWith(
      'wallet-1',
      1_000_000,
      expect.any(Number)
    );
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });

  it('reverses the linked income when hard deleting an unsettled borrow loan', async () => {
    const deps = makeDeps({
      getLoanById: vi.fn(async () => loan({ type: 'borrow' })),
    }, linkedTransaction({
      category_id: 'cat-vay-no',
      type: 'income',
      note: 'Vay nợ: Nguyen Van A',
    }));

    await deleteLoan('loan-1', 'hard', deps);

    expect(deps.transactionRepo.softDelete).toHaveBeenCalledWith('transaction-1', expect.any(Number));
    expect(deps.walletRepo.updateBalanceDelta).toHaveBeenCalledWith(
      'wallet-1',
      -1_000_000,
      expect.any(Number)
    );
  });

  it('blocks hard delete when payments exist', async () => {
    const deps = makeDeps({
      getTotalPaid: vi.fn(async () => 250_000),
    });

    await expect(deleteLoan('loan-1', 'hard', deps))
      .rejects.toThrow(LoanHasPaymentsError);

    expect(deps.loanRepo.hardDeleteLoan).not.toHaveBeenCalled();
    expect(deps.transactionRepo.softDelete).not.toHaveBeenCalled();
  });

  it('force hard deletes an unsettled loan with payments and refunds its linked transaction', async () => {
    const deps = makeDeps({
      getTotalPaid: vi.fn(async () => 250_000),
    });

    await deleteLoan('loan-1', 'hard', deps, { force: true });

    expect(deps.transactionRepo.softDelete).toHaveBeenCalledWith('transaction-1', expect.any(Number));
    expect(deps.walletRepo.updateBalanceDelta).toHaveBeenCalledWith(
      'wallet-1',
      1_000_000,
      expect.any(Number)
    );
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });

  it('keeps linked transaction and wallet balance when hard deleting a settled loan', async () => {
    const deps = makeDeps({
      getLoanById: vi.fn(async () => loan({
        status: 'settled',
        paid_amount: 1_000_000,
        remaining: 0,
      })),
      getTotalPaid: vi.fn(async () => 1_000_000),
    });

    await deleteLoan('loan-1', 'hard', deps, { force: true });

    expect(deps.transactionRepo.getByIdIncludeDeleted).not.toHaveBeenCalled();
    expect(deps.transactionRepo.softDelete).not.toHaveBeenCalled();
    expect(deps.walletRepo.updateBalanceDelta).not.toHaveBeenCalled();
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });

  it('keeps linked transaction when total payments show the loan is fully settled', async () => {
    const deps = makeDeps({
      getTotalPaid: vi.fn(async () => 1_000_000),
    });

    await deleteLoan('loan-1', 'hard', deps, { force: true });

    expect(deps.transactionRepo.softDelete).not.toHaveBeenCalled();
    expect(deps.walletRepo.updateBalanceDelta).not.toHaveBeenCalled();
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });

  it('does not refund an unsettled loan when its linked transaction was already deleted', async () => {
    const deps = makeDeps({}, linkedTransaction({ deleted_at: 123 }));

    await deleteLoan('loan-1', 'hard', deps);

    expect(deps.transactionRepo.softDelete).not.toHaveBeenCalled();
    expect(deps.walletRepo.updateBalanceDelta).not.toHaveBeenCalled();
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });

  it('can delete a hidden loan by falling back to includeDeleted list', async () => {
    const deps = makeDeps({
      getLoanById: vi.fn(async () => null),
      listLoans: vi.fn(async () => [loan({ deleted_at: 123 })]),
    });

    await deleteLoan('loan-1', 'hard', deps);

    expect(deps.loanRepo.listLoans).toHaveBeenCalledWith({ includeDeleted: true });
    expect(deps.transactionRepo.softDelete).toHaveBeenCalledWith('transaction-1', expect.any(Number));
    expect(deps.loanRepo.hardDeleteLoan).toHaveBeenCalledWith('loan-1');
  });
});
