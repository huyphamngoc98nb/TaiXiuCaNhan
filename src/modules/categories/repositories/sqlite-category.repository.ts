import { getDbConnection } from '@/core/db/sqlite/connection';
import type {
  Category,
  CategoryInput,
  CategoryReferenceCounts,
  CategoryType,
} from '../domain/category.model';
import { TRANSFER_CATEGORY_ID } from '../domain/category.model';

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: (row.slug as string | null) ?? null,
    name: row.name as string,
    type: row.type as CategoryType,
    icon: (row.icon as string | null) ?? null,
    color: (row.color as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    is_system: (row.is_system as 0 | 1) ?? 0,
    created_at: Number(row.created_at ?? 0),
    updated_at: Number(row.updated_at ?? 0),
  };
}

const CATEGORY_COLUMNS = 'id, slug, name, type, icon, color, description, is_system, created_at, updated_at';

export class SQLiteCategoryRepository {
  async list(type?: CategoryType): Promise<Category[]> {
    const db = await getDbConnection();
    const where = type ? 'AND type = ?' : '';
    const params = type ? [type] : [];
    const { values } = await db.query(
      `
        SELECT ${CATEGORY_COLUMNS}
        FROM categories
        WHERE id <> ?
          ${where}
        ORDER BY type ASC, name COLLATE NOCASE ASC
      `,
      [TRANSFER_CATEGORY_ID, ...params],
    );
    return (values ?? []).map((row) => mapCategory(row as Record<string, unknown>));
  }

  async getById(id: string): Promise<Category | null> {
    const db = await getDbConnection();
    const { values } = await db.query(
      `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE id = ? LIMIT 1`,
      [id],
    );
    if (!values || values.length === 0) return null;
    return mapCategory(values[0] as Record<string, unknown>);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const db = await getDbConnection();
    const { values } = await db.query(
      `SELECT ${CATEGORY_COLUMNS} FROM categories WHERE slug = ? LIMIT 1`,
      [slug],
    );
    if (!values || values.length === 0) return null;
    return mapCategory(values[0] as Record<string, unknown>);
  }

  async create(id: string, input: CategoryInput, now: number): Promise<void> {
    const db = await getDbConnection();
    await db.run(
      `
        INSERT INTO categories (id, name, type, icon, color, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        input.name.trim(),
        input.type,
        input.icon ?? null,
        input.color ?? null,
        input.description ?? null,
        now,
        now,
      ],
    );
  }

  async update(id: string, input: CategoryInput, now: number): Promise<void> {
    const db = await getDbConnection();
    await db.run(
      `
        UPDATE categories
        SET name = ?, type = ?, icon = ?, color = ?, description = ?, updated_at = ?
        WHERE id = ? AND id <> ? AND COALESCE(is_system, 0) = 0
      `,
      [
        input.name.trim(),
        input.type,
        input.icon ?? null,
        input.color ?? null,
        input.description ?? null,
        now,
        id,
        TRANSFER_CATEGORY_ID,
      ],
    );
  }

  async getReferenceCounts(id: string): Promise<CategoryReferenceCounts> {
    const db = await getDbConnection();
    const transactions = await db.query(
      'SELECT COUNT(*) AS count FROM transactions WHERE category_id = ? AND deleted_at IS NULL',
      [id],
    );
    const recurringBills = await db.query(
      'SELECT COUNT(*) AS count FROM recurring_bills WHERE category_id = ?',
      [id],
    );
    const budgets = await db.query(
      'SELECT COUNT(*) AS count FROM budgets WHERE category_id = ? AND is_active = 1',
      [id],
    );

    return {
      transactions: Number(transactions.values?.[0]?.count ?? 0),
      recurringBills: Number(recurringBills.values?.[0]?.count ?? 0),
      budgets: Number(budgets.values?.[0]?.count ?? 0),
    };
  }

  async delete(id: string): Promise<void> {
    const db = await getDbConnection();
    await db.run(
      'DELETE FROM categories WHERE id = ? AND id <> ? AND COALESCE(is_system, 0) = 0',
      [id, TRANSFER_CATEGORY_ID],
    );
  }
}
