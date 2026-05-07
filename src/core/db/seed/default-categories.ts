import { getDbConnection } from '../sqlite/connection';
import { logger } from '@/core/telemetry/logger';

export async function seedDefaultData() {
  const db = await getDbConnection();

  // Seed default wallet
  const { values: wallets } = await db.query('SELECT id FROM wallets LIMIT 1');
  if (!wallets || wallets.length === 0) {
    logger.info('Seeding default wallet...');
    await db.run(
      'INSERT INTO wallets (id, name, currency, balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      ['wallet-default-1', 'Main Wallet', 'USD', 0, Date.now(), Date.now()]
    );
  }

  // Seed default categories
  const { values: categories } = await db.query('SELECT id FROM categories LIMIT 1');
  if (!categories || categories.length === 0) {
    logger.info('Seeding default categories...');
    const defaultCategories = [
      { id: 'cat-inc-1', name: 'Salary', type: 'income', icon: 'briefcase', color: '#10b981' },
      { id: 'cat-inc-2', name: 'Investments', type: 'income', icon: 'trending-up', color: '#3b82f6' },
      { id: 'cat-exp-1', name: 'Food & Dining', type: 'expense', icon: 'coffee', color: '#f59e0b' },
      { id: 'cat-exp-2', name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#ec4899' },
      { id: 'cat-exp-3', name: 'Transport', type: 'expense', icon: 'truck', color: '#6366f1' },
      { id: 'cat-exp-4', name: 'Bills & Utilities', type: 'expense', icon: 'zap', color: '#ef4444' }
    ];

    for (const cat of defaultCategories) {
      await db.run(
        'INSERT INTO categories (id, name, type, icon, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [cat.id, cat.name, cat.type, cat.icon, cat.color, Date.now(), Date.now()]
      );
    }
  }
}
