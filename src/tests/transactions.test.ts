import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SQLiteTransactionRepository } from '../modules/transactions/repositories/sqlite-transaction.repository';
import { CreateTransactionUseCase } from '../modules/transactions/services/create-transaction';
import { UpdateTransactionUseCase } from '../modules/transactions/services/update-transaction';
import { DeleteTransactionUseCase } from '../modules/transactions/services/delete-transaction';
import { CreateCreditCardPaymentUseCase } from '../modules/transactions/services/create-credit-card-payment';
import { TransactionValidationError } from '../modules/transactions/domain/transaction.schema';
import { ReceiptStorageService } from '../core/files/receipt-storage';
import * as connection from '../core/db/sqlite/connection';
import { immediateTransactionRunner } from '@/core/db/transaction-runner';
import { InMemoryTransactionRepository } from './fakes/in-memory-transaction.repository';
import { InMemoryWalletRepository } from './fakes/in-memory-wallet.repository';
import type { Wallet } from '@/modules/wallets/repositories/wallet.repository';

// Mock dependencies
vi.mock('../core/db/sqlite/connection', () => ({
  DB_NAME: 'test_db',
  getDbConnection: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: () => 'web' },
}));

vi.mock('@/core/db/sqlite/pragmas', () => ({
  sqlite: { saveToStore: vi.fn() },
}));

vi.mock('../core/files/receipt-storage', () => ({
  ReceiptStorageService: {
    saveReceipt: vi.fn(),
    deleteReceipt: vi.fn(),
  }
}));

vi.mock('@/core/telemetry/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  }
}));

describe('Transaction Module QA Tests', () => {
  let mockDb: any;
  let repository: SQLiteTransactionRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDb = {
      run: vi.fn().mockResolvedValue({ changes: { changes: 1 } }),
      query: vi.fn().mockResolvedValue({ values: [] }),
    };
    vi.mocked(connection.getDbConnection).mockResolvedValue(mockDb);
    
    repository = new SQLiteTransactionRepository();
  });

  const walletRow = {
    id: 'w-1',
    name: 'Cash',
    currency: 'VND',
    balance: 10_000,
    account_type: 'cash',
    icon: null,
    color: null,
    sort_order: 0,
    is_active: 1,
    exclude_from_total: 0,
    credit_limit: null,
    statement_day: null,
    due_day: null,
    annual_fee: null,
    created_at: 0,
    updated_at: 0,
  } satisfies Wallet;

  describe('Repository Layer', () => {
    it('create() inserts correct values and maps note/receipt to null if empty', async () => {
      const input = {
        id: 'tx-1',
        wallet_id: 'w-1',
        category_id: 'c-1',
        type: 'expense' as const,
        amount: 100,
        transaction_date: 1000,
        created_at: 2000,
        updated_at: 2000
      };

      // Mock getById which is called after create
      mockDb.query.mockResolvedValueOnce({ values: [{ ...input, note: null, receipt_path: null, deleted_at: null }] });

      await repository.create(input);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO transactions'),
        ['tx-1', 'w-1', 'c-1', 'expense', 100, null, null, null, 1000, 2000, 2000],
        true
      );
    });

    it('list() builds correct WHERE clause for filters', async () => {
      await repository.list({ type: 'income', wallet_id: 'w-1' });
      
      const [sql, values] = mockDb.query.mock.calls[0];
      expect(sql).toContain('AND t.type = ?');
      expect(sql).toContain('AND t.wallet_id = ?');
      expect(sql).toContain('AND t.deleted_at IS NULL'); // Default behavior
      expect(values).toContain('income');
      expect(values).toContain('w-1');
    });

    it('softDelete() updates deleted_at column', async () => {
      await repository.softDelete('tx-1', 5000);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transactions SET deleted_at = ?, updated_at = ? WHERE id = ?'),
        [5000, 5000, 'tx-1'],
        true
      );
    });
  });

  describe('Service Layer (Use Cases)', () => {
    const validCreateInput = {
      wallet_id: 'w-1',
      category_id: 'c-1',
      type: 'expense' as const,
      amount: 50,
      transaction_date: Date.now(),
    };
    const destinationWallet = {
      ...walletRow,
      id: 'w-2',
      name: 'Bank',
      balance: 1_000,
    } satisfies Wallet;
    const creditCardWallet = {
      ...walletRow,
      id: 'cc-1',
      name: 'Visa',
      balance: 0,
      account_type: 'credit_card' as const,
      credit_limit: 5_000,
      statement_day: 15,
      due_day: 5,
    } satisfies Wallet;

    it('CreateTransactionUseCase validates input before executing', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );
      const invalidInput = { ...validCreateInput, amount: -10 };
      await expect(createUseCase.execute(invalidInput)).rejects.toThrow(TransactionValidationError);
      expect(mockDb.run).not.toHaveBeenCalled();
    });

    it('CreateTransactionUseCase cleans up receipt file if DB insert fails', async () => {
      class FailingTransactionRepository extends InMemoryTransactionRepository {
        override async create(): Promise<never> {
          throw new Error('DB Error');
        }
      }

      const transactionRepository = new FailingTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      vi.mocked(ReceiptStorageService.saveReceipt).mockResolvedValue('path/to/receipt.jpg');

      await expect(createUseCase.execute(validCreateInput, 'base64data')).rejects.toThrow('DB Error');
      
      expect(ReceiptStorageService.saveReceipt).toHaveBeenCalledWith('base64data');
      expect(ReceiptStorageService.deleteReceipt).toHaveBeenCalledWith('path/to/receipt.jpg');
    });

    it('UpdateTransactionUseCase deletes old receipt if new one is successfully saved', async () => {
      const oldTx = {
        ...validCreateInput,
        id: 'tx-1',
        note: null,
        receipt_path: 'old.jpg',
        to_wallet_id: null,
        created_at: 0,
        updated_at: 0,
        deleted_at: null,
      };
      const transactionRepository = new InMemoryTransactionRepository([oldTx]);
      const walletRepository = new InMemoryWalletRepository([walletRow]);
      const updateUseCase = new UpdateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      vi.mocked(ReceiptStorageService.saveReceipt).mockResolvedValue('new.jpg');

      await updateUseCase.execute('tx-1', { amount: 60 }, 'newBase64');

      expect(ReceiptStorageService.deleteReceipt).toHaveBeenCalledWith('old.jpg');
    });

    it('UpdateTransactionUseCase validates expense edits against the new wallet when wallet changes', async () => {
      const oldTx = {
        ...validCreateInput,
        id: 'tx-1',
        type: 'expense' as const,
        amount: 5_400_000,
        note: null,
        receipt_path: null,
        to_wallet_id: null,
        created_at: 0,
        updated_at: 0,
        deleted_at: null,
      };
      const newWallet = {
        ...walletRow,
        id: 'w-2',
        name: 'Bank',
        balance: 10_000_000,
      } satisfies Wallet;
      const transactionRepository = new InMemoryTransactionRepository([oldTx]);
      const walletRepository = new InMemoryWalletRepository([
        { ...walletRow, balance: -5_400_000 },
        newWallet,
      ]);
      const updateUseCase = new UpdateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      await updateUseCase.execute('tx-1', { wallet_id: 'w-2', amount: 5_400_000 });

      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 0 });
      await expect(walletRepository.getById('w-2')).resolves.toMatchObject({ balance: 4_600_000 });
      await expect(transactionRepository.getById('tx-1')).resolves.toMatchObject({
        wallet_id: 'w-2',
        amount: 5_400_000,
      });
    });

    it('CreateTransactionUseCase moves balance between wallets for transfers', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow, destinationWallet]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      const tx = await createUseCase.execute({
        ...validCreateInput,
        type: 'transfer',
        amount: 2_500,
        to_wallet_id: 'w-2',
      });

      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 7_500 });
      await expect(walletRepository.getById('w-2')).resolves.toMatchObject({ balance: 3_500 });
      expect(tx.to_wallet_id).toBe('w-2');
    });

    it('creating an expense on a cash wallet reduces cash balance', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      await createUseCase.execute(validCreateInput);

      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 9_950 });
    });

    it('creating an expense on a credit card increases liability without touching cash', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow, creditCardWallet]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      await createUseCase.execute({
        ...validCreateInput,
        wallet_id: 'cc-1',
        amount: 250,
      });

      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 10_000 });
      await expect(walletRepository.getById('cc-1')).resolves.toMatchObject({ balance: -250 });
    });

    it('credit card payment reduces source balance and card liability as a transfer', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([
        walletRow,
        { ...creditCardWallet, balance: -1_200 },
      ]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );
      const paymentUseCase = new CreateCreditCardPaymentUseCase(createUseCase, walletRepository);

      const tx = await paymentUseCase.execute({
        from_wallet_id: 'w-1',
        credit_card_wallet_id: 'cc-1',
        category_id: 'cat-transfer',
        amount: 700,
        transaction_date: Date.now(),
      });

      expect(tx.type).toBe('transfer');
      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 9_300 });
      await expect(walletRepository.getById('cc-1')).resolves.toMatchObject({ balance: -500 });
    });

    it('blocks credit card payments when the source wallet has insufficient balance', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([
        { ...walletRow, balance: 100 },
        { ...creditCardWallet, balance: -1_200 },
      ]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );
      const paymentUseCase = new CreateCreditCardPaymentUseCase(createUseCase, walletRepository);

      await expect(paymentUseCase.execute({
        from_wallet_id: 'w-1',
        credit_card_wallet_id: 'cc-1',
        category_id: 'cat-transfer',
        amount: 700,
        transaction_date: Date.now(),
      })).rejects.toThrow(TransactionValidationError);
    });

    it('rejects card-payment flow when target wallet is not a credit card', async () => {
      const transactionRepository = new InMemoryTransactionRepository();
      const walletRepository = new InMemoryWalletRepository([walletRow, destinationWallet]);
      const createUseCase = new CreateTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );
      const paymentUseCase = new CreateCreditCardPaymentUseCase(createUseCase, walletRepository);

      await expect(paymentUseCase.execute({
        from_wallet_id: 'w-1',
        credit_card_wallet_id: 'w-2',
        category_id: 'cat-transfer',
        amount: 100,
        transaction_date: Date.now(),
      })).rejects.toThrow(TransactionValidationError);
    });

    it('DeleteTransactionUseCase reverts both wallets for transfers', async () => {
      const transactionRepository = new InMemoryTransactionRepository([{
        ...validCreateInput,
        id: 'tx-transfer',
        type: 'transfer',
        amount: 2_500,
        to_wallet_id: 'w-2',
        note: null,
        receipt_path: null,
        created_at: 0,
        updated_at: 0,
        deleted_at: null,
      }]);
      const walletRepository = new InMemoryWalletRepository([
        { ...walletRow, balance: 7_500 },
        { ...destinationWallet, balance: 3_500 },
      ]);
      const deleteUseCase = new DeleteTransactionUseCase(
        transactionRepository,
        walletRepository,
        immediateTransactionRunner
      );

      await deleteUseCase.execute('tx-transfer');

      await expect(walletRepository.getById('w-1')).resolves.toMatchObject({ balance: 10_000 });
      await expect(walletRepository.getById('w-2')).resolves.toMatchObject({ balance: 1_000 });
    });
  });
});
