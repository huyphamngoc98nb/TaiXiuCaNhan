import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { sqlite } from '@/core/db/sqlite/pragmas';
import { AuthService } from '@/core/auth/auth.service';

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(),
  },
}));

vi.mock('@capacitor-community/sqlite', () => ({
  CapacitorSQLite: {
    addListener: vi.fn(),
  },
}));

vi.mock('@/core/db/sqlite/pragmas', () => ({
  sqlite: {
    isSecretStored: vi.fn(),
    setEncryptionSecret: vi.fn(),
    checkEncryptionSecret: vi.fn(),
    isInConfigBiometricAuth: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
  });

  it('does not require unlock on web', async () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

    const service = new AuthService();
    await expect(service.unlockWithPin('')).resolves.toEqual({
      authenticated: true,
      createdSecret: false,
    });
    expect(sqlite.setEncryptionSecret).not.toHaveBeenCalled();
    expect(sqlite.checkEncryptionSecret).not.toHaveBeenCalled();
  });

  it('stores first native PIN in sqlite secure secret store', async () => {
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: false });

    const result = await new AuthService().unlockWithPin('123456');

    expect(result).toEqual({ authenticated: true, createdSecret: true });
    expect(sqlite.setEncryptionSecret).toHaveBeenCalledWith('123456');
    expect(sqlite.checkEncryptionSecret).not.toHaveBeenCalled();
  });

  it('checks existing native secret before unlock succeeds', async () => {
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: true });
    vi.mocked(sqlite.checkEncryptionSecret).mockResolvedValue({ result: true });

    const result = await new AuthService().unlockWithPin('654321');

    expect(result).toEqual({ authenticated: true, createdSecret: false });
    expect(sqlite.setEncryptionSecret).not.toHaveBeenCalled();
    expect(sqlite.checkEncryptionSecret).toHaveBeenCalledWith('654321');
  });

  it('rejects invalid native PIN', async () => {
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: true });
    vi.mocked(sqlite.checkEncryptionSecret).mockResolvedValue({ result: false });

    await expect(new AuthService().unlockWithPin('654321')).rejects.toThrow('Invalid PIN');
  });

  it('unlocks with biometrics when native biometric auth exposes a stored secret', async () => {
    vi.mocked(sqlite.isInConfigBiometricAuth).mockResolvedValue({ result: true });
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: true });

    await expect(new AuthService().unlockWithBiometrics()).resolves.toEqual({
      authenticated: true,
      createdSecret: false,
    });
    expect(sqlite.checkEncryptionSecret).not.toHaveBeenCalled();
  });

  it('keeps PIN required when biometric auth has no stored secret yet', async () => {
    vi.mocked(sqlite.isInConfigBiometricAuth).mockResolvedValue({ result: true });
    vi.mocked(sqlite.isSecretStored).mockResolvedValue({ result: false });

    await expect(new AuthService().unlockWithBiometrics()).resolves.toBeNull();
  });
});
