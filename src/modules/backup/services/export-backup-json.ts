import { getDbConnection } from '@/core/db/sqlite/connection';
import { BackupPayload } from '../domain/backup.model';

export async function exportBackupJson(): Promise<BackupPayload> {
  const db = await getDbConnection();

  const tables = ['wallets', 'categories', 'transactions', 'recurring_bills', 'app_settings'];
  const data: any = {};

  for (const table of tables) {
    const { values } = await db.query(`SELECT * FROM ${table}`);
    data[table] = values || [];
  }

  const payload: BackupPayload = {
    metadata: {
      version: '1.0',
      exported_at: Date.now(),
      app_version: '1.0.0', // Hardcoded for now
    },
    wallets: data.wallets,
    categories: data.categories,
    transactions: data.transactions,
    recurring_bills: data.recurring_bills,
    app_settings: data.app_settings,
  };

  return payload;
}
