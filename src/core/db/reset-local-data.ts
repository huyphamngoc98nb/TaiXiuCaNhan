import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { DB_NAME } from './sqlite/connection';
import { sqlite } from './sqlite/pragmas';
import {
  resumeWebPersistenceAfterReset,
  suspendWebPersistenceForReset,
  waitForPendingDatabaseWork,
} from './sqlite/transaction';
import { logger } from '@/core/telemetry/logger';

export type ResetLocalDataStep =
  | 'pause_listeners_or_sync'
  | 'close_database_session'
  | 'delete_encrypted_local_data'
  | 'clear_persisted_app_state_cache'
  | 'delete_encryption_secret_pin_secret'
  | 'verify_deletion'
  | 'reset_navigation_app_state';

export class ResetLocalDataError extends Error {
  constructor(
    public readonly step: ResetLocalDataStep,
    cause: unknown,
  ) {
    const causeMessage = cause instanceof Error ? cause.message : String(cause);
    super(`Reset local data failed at ${step}: ${causeMessage}`);
    this.name = 'ResetLocalDataError';
  }
}

const LOCAL_STORAGE_RESET_KEYS = [
  'themePreference',
  'app_currency',
  'dashboard_show_amounts',
  'transaction_draft',
  'transaction_last_successful_create',
  'tai_xiu_pending_error_logs',
];

async function runResetStep<T>(step: ResetLocalDataStep, work: () => Promise<T>): Promise<T> {
  logger.info(`Reset local data: starting ${step}`);
  try {
    const result = await work();
    logger.info(`Reset local data: completed ${step}`);
    return result;
  } catch (error) {
    logger.error(`Reset local data: failed ${step}`, error);
    throw new ResetLocalDataError(step, error);
  }
}

async function closeDatabaseSession(): Promise<void> {
  await waitForPendingDatabaseWork();
  await sqlite.checkConnectionsConsistency();

  const connectionExists = (await sqlite.isConnection(DB_NAME, false)).result === true;
  if (!connectionExists) {
    return;
  }

  if (Capacitor.getPlatform() === 'web') {
    const db = await sqlite.retrieveConnection(DB_NAME, false);
    try {
      await db.close();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('database not opened')) {
        throw error;
      }
    }
    return;
  }

  await sqlite.closeConnection(DB_NAME, false);
}

export async function deleteLocalDatabase(): Promise<void> {
  await closeDatabaseSession();
  await CapacitorSQLite.deleteDatabase({
    database: DB_NAME,
    readonly: false,
  });
}

export async function clearNativeEncryptionSecret(): Promise<void> {
  if (Capacitor.getPlatform() === 'web') return;
  const secretExists = (await sqlite.isSecretStored()).result === true;
  if (!secretExists) return;
  await sqlite.clearEncryptionSecret();
}

async function clearPersistedAppStateAndCache(): Promise<void> {
  await Preferences.clear();

  if (typeof window !== 'undefined') {
    try {
      for (const key of LOCAL_STORAGE_RESET_KEYS) {
        window.localStorage.removeItem(key);
      }
      window.sessionStorage.clear();
    } catch (error) {
      throw new Error(`Browser storage clear failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (typeof caches !== 'undefined') {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }
}

async function verifyDeletion(): Promise<void> {
  const databaseExists = (await sqlite.isDatabase(DB_NAME)).result === true;
  if (databaseExists) {
    throw new Error(`SQLite database ${DB_NAME} still exists after deleteDatabase.`);
  }

  if (Capacitor.getPlatform() !== 'web') {
    const secretExists = (await sqlite.isSecretStored()).result === true;
    if (secretExists) {
      throw new Error('Native SQLite encryption secret is still stored after clearEncryptionSecret.');
    }
  }

  if (typeof window !== 'undefined') {
    const remainingLocalKeys = LOCAL_STORAGE_RESET_KEYS.filter(
      (key) => window.localStorage.getItem(key) !== null,
    );
    if (remainingLocalKeys.length > 0) {
      throw new Error(`Local storage keys still exist after reset: ${remainingLocalKeys.join(', ')}`);
    }
  }

  const preferenceKeys = (await Preferences.keys()).keys;
  if (preferenceKeys.length > 0) {
    throw new Error(`Capacitor Preferences keys still exist after reset: ${preferenceKeys.join(', ')}`);
  }
}

export async function resetLocalDataStorage(): Promise<void> {
  await runResetStep('pause_listeners_or_sync', async () => {
    suspendWebPersistenceForReset();
    await waitForPendingDatabaseWork();
  });

  try {
    await runResetStep('close_database_session', closeDatabaseSession);
    await runResetStep('delete_encrypted_local_data', async () => {
      await CapacitorSQLite.deleteDatabase({
        database: DB_NAME,
        readonly: false,
      });
    });
    await runResetStep('clear_persisted_app_state_cache', clearPersistedAppStateAndCache);
    await runResetStep('delete_encryption_secret_pin_secret', clearNativeEncryptionSecret);
    await runResetStep('verify_deletion', verifyDeletion);
  } catch (error) {
    resumeWebPersistenceAfterReset();
    throw error;
  }
}

export function completeResetNavigationState(): void {
  resumeWebPersistenceAfterReset();
  logger.info('Reset local data: completed reset_navigation_app_state');
}
