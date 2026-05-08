import { getDbConnection } from './connection';

export async function runInTransaction<T>(
  work: (db: any) => Promise<T>
): Promise<T> {
  const db = await getDbConnection();
  
  const { result: isActive } = await db.isTransactionActive();
  const shouldManageTransaction = !isActive;

  if (shouldManageTransaction) {
    await db.beginTransaction();
  }

  try {
    const result = await work(db);
    if (shouldManageTransaction) {
      await db.commitTransaction();
    }
    return result;
  } catch (error) {
    if (shouldManageTransaction) {
      await db.rollbackTransaction();
    }
    throw error;
  }
}
