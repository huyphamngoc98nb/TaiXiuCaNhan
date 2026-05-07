import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

export const sqlite = new SQLiteConnection(CapacitorSQLite);

export const PRAGMAS = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
`;

export async function applyPragmas(dbName: string) {
  const db = await sqlite.retrieveConnection(dbName, false);
  await db.execute(PRAGMAS);
}
