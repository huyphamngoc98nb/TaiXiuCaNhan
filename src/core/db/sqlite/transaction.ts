import { getDbConnection } from './connection';

export async function runInTransaction<T>(
  work: (db: any) => Promise<T>
): Promise<T> {
  const db = await getDbConnection();
  
  await db.beginTransaction();
  try {
    const result = await work(db);
    await db.commitTransaction();
    return result;
  } catch (error) {
    await db.rollbackTransaction();
    throw error;
  }
}
