import { getDbConnection } from '@/core/db/sqlite/connection';
import { BackupPayload } from '../domain/backup.model';
import { logger } from '@/core/telemetry/logger';

export async function restoreDatabase(payload: BackupPayload): Promise<void> {
  const db = await getDbConnection();
  
  try {
    logger.info('Starting database restore...');
    
    // 1. Prepare deletion statements
    const tables = ['transactions', 'recurring_bills', 'categories', 'wallets', 'app_settings'];
    const deleteStatements = tables.map(table => ({
      statement: `DELETE FROM ${table}`,
      values: []
    }));

    // 2. Prepare insertion statements
    const insertStatements: any[] = [];

    // Order matters for foreign keys: wallets -> categories -> transactions -> recurring_bills
    
    // Wallets
    payload.wallets.forEach(row => {
      insertStatements.push({
        statement: `INSERT INTO wallets (id, name, type, balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        values: [row.id, row.name, row.type, row.balance, row.created_at, row.updated_at]
      });
    });

    // Categories
    payload.categories.forEach(row => {
      insertStatements.push({
        statement: `INSERT INTO categories (id, name, type, icon, color, budget_amount, budget_period, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [row.id, row.name, row.type, row.icon, row.color, row.budget_amount, row.budget_period, row.created_at, row.updated_at]
      });
    });

    // Transactions
    payload.transactions.forEach(row => {
      insertStatements.push({
        statement: `INSERT INTO transactions (id, wallet_id, category_id, type, amount, note, receipt_path, transaction_date, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [row.id, row.wallet_id, row.category_id, row.type, row.amount, row.note, row.receipt_path, row.transaction_date, row.created_at, row.updated_at, row.deleted_at]
      });
    });

    // Recurring Bills
    payload.recurring_bills.forEach(row => {
      insertStatements.push({
        statement: `INSERT INTO recurring_bills (id, wallet_id, category_id, name, amount, frequency, next_due_date, reminder_days, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values: [row.id, row.wallet_id, row.category_id, row.name, row.amount, row.frequency, row.next_due_date, row.reminder_days, row.is_active, row.created_at, row.updated_at]
      });
    });

    // App Settings
    payload.app_settings.forEach(row => {
      insertStatements.push({
        statement: `INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, ?)`,
        values: [row.key, row.value, row.updated_at]
      });
    });

    // 3. Execute all in a single batch (Capacitor SQLite executeSet uses a transaction internally)
    const set = [...deleteStatements, ...insertStatements];
    
    // We should disable foreign keys during wipe-and-reload to avoid constraint errors during the transition
    await db.run('PRAGMA foreign_keys = OFF');
    
    const result = await db.executeSet(set);
    
    if (result.changes && (result.changes.changes ?? 0) < 0) {
      throw new Error('Database restore failed: Batch execution returned error status.');
    }

    await db.run('PRAGMA foreign_keys = ON');

    // On web, we must save to store
    const isWeb = (await import('@capacitor/core')).Capacitor.getPlatform() === 'web';
    if (isWeb) {
      await (await import('@/core/db/sqlite/pragmas')).sqlite.saveToStore('expense_tracker_db');
    }

    logger.info('Database restore completed successfully.');
  } catch (error) {
    logger.error('Failed to restore database', error);
    // Ensure foreign keys are back on even if we fail
    await db.run('PRAGMA foreign_keys = ON');
    throw error;
  }
}
