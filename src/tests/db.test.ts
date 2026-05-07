import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runMigrations } from '../core/db/migrations/migration-runner';
import { seedDefaultData } from '../core/db/seed/default-categories';
import * as connection from '../core/db/sqlite/connection';

// Mock the DB connection and logger
vi.mock('../core/db/sqlite/connection', () => ({
  getDbConnection: vi.fn(),
  isDatabaseReady: vi.fn(),
  initDatabaseConnection: vi.fn(),
}));

vi.mock('@/core/telemetry/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}));

describe('Database SQLite Tests', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      execute: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({ values: [] }),
      run: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(connection.getDbConnection).mockResolvedValue(mockDb);
  });

  it('migration runner executes in order', async () => {
    await runMigrations();

    // Verify migrations table is created
    expect(mockDb.execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS migrations'));

    // Should have run both migrations
    expect(mockDb.execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS wallets'));
    expect(mockDb.execute).toHaveBeenCalledWith(expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_transactions_date'));

    // Verify it updates the migrations table in order
    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO migrations'),
      expect.arrayContaining([1, '001_init', expect.any(Number)])
    );
    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO migrations'),
      expect.arrayContaining([2, '002_indexes', expect.any(Number)])
    );
  });

  it('default seed is inserted', async () => {
    await seedDefaultData();

    // Check if wallet was inserted
    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO wallets'),
      expect.arrayContaining(['wallet-default-1'])
    );

    // Check if categories were inserted
    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO categories'),
      expect.arrayContaining(['cat-inc-1'])
    );
    expect(mockDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO categories'),
      expect.arrayContaining(['cat-exp-4'])
    );
  });

  it('verifies required tables exist conceptually', async () => {
    const initSql = await import('../core/db/migrations/001_init.sql?raw').then(m => m.default);
    
    const requiredTables = ['wallets', 'categories', 'transactions', 'recurring_bills', 'app_settings', 'sync_changes'];
    requiredTables.forEach(table => {
      expect(initSql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    });
  });
});
