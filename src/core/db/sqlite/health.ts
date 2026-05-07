import { getDbConnection } from './connection';

export async function getSchemaVersion(): Promise<number> {
  try {
    const db = await getDbConnection();
    const { values } = await db.query('SELECT version FROM migrations ORDER BY version DESC LIMIT 1');
    return values && values.length > 0 ? values[0].version : 0;
  } catch (e) {
    return 0;
  }
}

export async function listTables(): Promise<string[]> {
  try {
    const db = await getDbConnection();
    const { values } = await db.query("SELECT name FROM sqlite_master WHERE type='table'");
    return values ? values.map((v: any) => v.name) : [];
  } catch (e) {
    return [];
  }
}

export async function countCategories(): Promise<number> {
  try {
    const db = await getDbConnection();
    const { values } = await db.query('SELECT COUNT(*) as count FROM categories');
    return values && values.length > 0 ? values[0].count : 0;
  } catch (e) {
    return 0;
  }
}
