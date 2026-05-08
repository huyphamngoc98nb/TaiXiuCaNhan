import { getDbConnection } from '@/core/db/sqlite/connection';
import type { AccountType } from '@/modules/budgets/domain/budget.model';

// BUG FIX #8: interface Wallet cũ thiếu các field đã thêm như account_type, is_active...
// đồng bộ với Wallet interface trong budget.model.ts
export interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: number;
  account_type: AccountType;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  exclude_from_total: boolean;
  updated_at: number;
  created_at: number;
}

export class SQLiteWalletRepository {
  async getById(id: string): Promise<Wallet | null> {
    const db = await getDbConnection();
    const { values } = await db.query(
      `SELECT id, name, currency, balance,
              account_type, icon, color, sort_order,
              is_active, exclude_from_total,
              created_at, updated_at
       FROM wallets WHERE id = ?`,
      [id]
    );
    if (!values || values.length === 0) return null;
    const row = values[0] as Record<string, unknown>;
    return {
      ...row,
      is_active: Boolean(row.is_active),
      exclude_from_total: Boolean(row.exclude_from_total),
    } as Wallet;
  }

  /** Lấy tất cả ví đang active, sắp xếp theo sort_order */
  async getAll(includeInactive = false): Promise<Wallet[]> {
    const db = await getDbConnection();
    const whereClause = includeInactive ? '' : 'WHERE is_active = 1';
    const { values } = await db.query(
      `SELECT id, name, currency, balance,
              account_type, icon, color, sort_order,
              is_active, exclude_from_total,
              created_at, updated_at
       FROM wallets ${whereClause}
       ORDER BY sort_order ASC, created_at ASC`
    );
    return (values ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      is_active: Boolean(row.is_active),
      exclude_from_total: Boolean(row.exclude_from_total),
    })) as Wallet[];
  }

  async updateBalance(id: string, newBalance: number, updatedAt: number): Promise<void> {
    const db = await getDbConnection();
    await db.run(
      'UPDATE wallets SET balance = ?, updated_at = ? WHERE id = ?',
      [newBalance, updatedAt, id]
    );
  }

  /**
   * Atomic balance delta — safe against race conditions.
   * BUG FIX #9: thêm guard kiểm tra wallet tồn tại trước khi update.
   */
  async updateBalanceDelta(id: string, delta: number, updatedAt: number): Promise<void> {
    const db = await getDbConnection();
    const result = await db.run(
      'UPDATE wallets SET balance = balance + ?, updated_at = ? WHERE id = ? AND is_active = 1',
      [delta, updatedAt, id]
    );
    // changes === 0 nghĩa là wallet không tồn tại hoặc đã bị archive
    if ((result?.changes ?? 0) === 0) {
      throw new Error(`Wallet ${id} not found or inactive — balance update aborted`);
    }
  }
}
