import { getDbConnection } from './connection';
import { Capacitor } from '@capacitor/core';

let nativeTransactionQueue: Promise<void> = Promise.resolve();
let managedTransactionDepth = 0;

export function isManagedTransactionActive(): boolean {
  return managedTransactionDepth > 0;
}

async function runExclusive<T>(work: () => Promise<T>): Promise<T> {
  const previous = nativeTransactionQueue;
  let release = () => {};

  const lock = new Promise<void>((resolve) => {
    release = resolve;
  });

  nativeTransactionQueue = previous.catch(() => undefined).then(() => lock);
  await previous.catch(() => undefined);

  try {
    return await work();
  } finally {
    release();
  }
}

/**
 * Wraps `work` in a SQLite transaction.
 *
 * - Native (iOS/Android): uses BEGIN / COMMIT / ROLLBACK.
 * - Web: CapacitorSQLite does not support explicit transactions on the web
 *   store; we execute the work directly and let the caller invoke
 *   `sqlite.saveToStore()` afterwards if persistence is needed.
 *
 * Nested-transaction safe: if a transaction is already active the inner
 * call simply participates in the outer one (no SAVEPOINT).
 */
export async function runInTransaction<T>(
  work: (db: any) => Promise<T>
): Promise<T> {
  const db = await getDbConnection();
  const isWeb = Capacitor.getPlatform() === 'web';

  // On web, CapacitorSQLite does not support beginTransaction — run directly.
  if (isWeb) {
    return work(db);
  }

  if (isManagedTransactionActive()) {
    return work(db);
  }

  return runExclusive(async () => {
    const { result: isActive } = await db.isTransactionActive();
    const shouldManage = !isActive;

    if (shouldManage) {
      await db.beginTransaction();
      managedTransactionDepth += 1;
    }

    try {
      const result = await work(db);
      if (shouldManage) {
        await db.commitTransaction();
      }
      return result;
    } catch (error) {
      if (shouldManage) {
        await db.rollbackTransaction();
      }
      throw error;
    } finally {
      if (shouldManage) {
        managedTransactionDepth -= 1;
      }
    }
  });
}
