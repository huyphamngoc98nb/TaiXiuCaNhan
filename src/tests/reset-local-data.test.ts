import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import {
  clearNativeEncryptionSecret,
  completeResetNavigationState,
  deleteLocalDatabase,
  resetLocalDataStorage,
} from '@/core/db/reset-local-data';
import { sqlite } from '@/core/db/sqlite/pragmas';

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(),
  },
}));

vi.mock('@capacitor-community/sqlite', () => ({
  CapacitorSQLite: {
    deleteDatabase: vi.fn(),
  },
  SQLiteConnection: vi.fn(),
}));

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    clear: vi.fn(),
    keys: vi.fn(),
  },
}));

vi.mock('@/core/db/sqlite/pragmas', () => ({
  sqlite: {
    isConnection: vi.fn(),
    retrieveConnection: vi.fn(),
    closeConnection: vi.fn(),
    checkConnectionsConsistency: vi.fn(),
    clearEncryptionSecret: vi.fn(),
    isSecretStored: vi.fn(),
    isDatabase: vi.fn(),
  },
}));

describe('reset local data SQLite helpers', () => {
  function mockDbConnection(close: () => Promise<void>) {
    return { close } as unknown as Awaited<ReturnType<typeof sqlite.retrieveConnection>>;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    vi.mocked(sqlite.isConnection).mockResolvedValue({ result: false });
    vi.mocked(sqlite.retrieveConnection).mockResolvedValue(mockDbConnection(vi.fn()));
    vi.mocked(sqlite.checkConnectionsConsistency).mockResolvedValue({ result: true });
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: true });
    vi.mocked(sqlite.isDatabase).mockResolvedValue({ result: false });
    vi.mocked(Preferences.keys).mockResolvedValue({ keys: [] });
  });

  it('closes an existing connection before deleting the local database', async () => {
    const calls: string[] = [];
    vi.mocked(sqlite.isConnection).mockResolvedValue({ result: true });
    vi.mocked(sqlite.closeConnection).mockImplementation(async () => { calls.push('close'); });
    vi.mocked(CapacitorSQLite.deleteDatabase).mockImplementation(async () => { calls.push('delete'); });

    await deleteLocalDatabase();

    expect(calls).toEqual(['close', 'delete']);
  });

  it('clears native secrets but skips unsupported web secret storage', async () => {
    await clearNativeEncryptionSecret();
    expect(sqlite.clearEncryptionSecret).toHaveBeenCalledTimes(1);

    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
    await clearNativeEncryptionSecret();
    expect(sqlite.clearEncryptionSecret).toHaveBeenCalledTimes(1);
  });

  it('runs reset steps in order and deletes the encryption secret after local data', async () => {
    const calls: string[] = [];
    vi.mocked(sqlite.isConnection).mockImplementation(async () => {
      calls.push('isConnection');
      return { result: true };
    });
    vi.mocked(sqlite.closeConnection).mockImplementation(async () => { calls.push('close'); });
    vi.mocked(CapacitorSQLite.deleteDatabase).mockImplementation(async () => { calls.push('deleteDatabase'); });
    vi.mocked(Preferences.clear).mockImplementation(async () => { calls.push('preferences'); });
    vi.mocked(sqlite.clearEncryptionSecret).mockImplementation(async () => { calls.push('secret'); });
    vi.mocked(sqlite.isSecretStored)
      .mockResolvedValueOnce({ result: true })
      .mockResolvedValueOnce({ result: false });
    vi.mocked(sqlite.isDatabase).mockImplementation(async () => {
      calls.push('verifyDatabase');
      return { result: false };
    });

    window.localStorage.setItem('transaction_draft', '{}');
    await resetLocalDataStorage();
    completeResetNavigationState();

    expect(calls).toEqual([
      'isConnection',
      'close',
      'deleteDatabase',
      'preferences',
      'secret',
      'verifyDatabase',
    ]);
    expect(window.localStorage.getItem('transaction_draft')).toBeNull();
  });

  it('keeps the web connection registered while deleting the web database', async () => {
    const calls: string[] = [];
    const db = {
      close: vi.fn(async () => { calls.push('db.close'); }),
    };
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
    vi.mocked(sqlite.isConnection).mockImplementation(async () => {
      calls.push('isConnection');
      return { result: true };
    });
    vi.mocked(sqlite.retrieveConnection).mockImplementation(async () => {
      calls.push('retrieve');
      return mockDbConnection(db.close);
    });
    vi.mocked(CapacitorSQLite.deleteDatabase).mockImplementation(async () => {
      calls.push('deleteDatabase');
    });
    vi.mocked(Preferences.clear).mockImplementation(async () => { calls.push('preferences'); });
    vi.mocked(sqlite.isDatabase).mockResolvedValue({ result: false });

    await resetLocalDataStorage();
    completeResetNavigationState();

    expect(calls).toEqual([
      'isConnection',
      'retrieve',
      'db.close',
      'deleteDatabase',
      'preferences',
    ]);
    expect(sqlite.closeConnection).not.toHaveBeenCalled();
    expect(sqlite.clearEncryptionSecret).not.toHaveBeenCalled();
  });

  it('fails verification when the database or secret still exists', async () => {
    vi.mocked(sqlite.isDatabase).mockResolvedValueOnce({ result: true });
    await expect(resetLocalDataStorage()).rejects.toThrow('verify_deletion');

    vi.mocked(sqlite.isDatabase).mockResolvedValue({ result: false });
    vi.mocked(sqlite.isSecretStored)
      .mockResolvedValueOnce({ result: true })
      .mockResolvedValueOnce({ result: true });
    await expect(resetLocalDataStorage()).rejects.toThrow('verify_deletion');
  });
});
