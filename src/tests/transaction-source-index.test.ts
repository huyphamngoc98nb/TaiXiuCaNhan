import { describe, expect, it } from 'vitest';
import migrationSql from '@/core/db/migrations/035_transaction_source_metadata.sql?raw';

describe('transaction source metadata migration', () => {
  it('enforces one active transaction per source event and allows recreation after soft delete', async () => {
    // sql.js ships without TypeScript declarations in this project.
    // @ts-expect-error -- runtime package is provided by the app dependency.
    const initSqlJs = (await import('sql.js')).default;
    const wasmPath = `${(globalThis as typeof globalThis & {
      process: { cwd(): string };
    }).process.cwd()}/node_modules/sql.js/dist/sql-wasm.wasm`;
    const SQL = await initSqlJs({
      locateFile: () => wasmPath,
    });
    const db = new SQL.Database();

    try {
      db.run(`
        CREATE TABLE transactions (
          id TEXT PRIMARY KEY,
          deleted_at INTEGER
        );
      `);
      db.run(migrationSql);

      db.run(
        `INSERT INTO transactions (id, source_type, source_id, source_event)
         VALUES (?, ?, ?, ?)`,
        ['tx-1', 'loan', 'loan-1', 'opening']
      );

      expect(() => db.run(
        `INSERT INTO transactions (id, source_type, source_id, source_event)
         VALUES (?, ?, ?, ?)`,
        ['tx-2', 'loan', 'loan-1', 'opening']
      )).toThrow(/UNIQUE constraint failed/i);

      db.run(`UPDATE transactions SET deleted_at = 123 WHERE id = 'tx-1'`);
      expect(() => db.run(
        `INSERT INTO transactions (id, source_type, source_id, source_event)
         VALUES (?, ?, ?, ?)`,
        ['tx-2', 'loan', 'loan-1', 'opening']
      )).not.toThrow();

      db.run(`INSERT INTO transactions (id) VALUES ('legacy-1'), ('legacy-2')`);
      expect(db.exec('SELECT COUNT(*) AS count FROM transactions')[0].values[0][0]).toBe(4);
    } finally {
      db.close();
    }
  });
});
