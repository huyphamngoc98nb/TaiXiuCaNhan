import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerPlugin } from '@capacitor/core';
import { ApkInstaller, installApk } from '@/plugins/apkInstaller';

const mocks = vi.hoisted(() => ({
  installApk: vi.fn(),
  registerPlugin: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  registerPlugin: mocks.registerPlugin.mockReturnValue({
    installApk: mocks.installApk,
  }),
}));

describe('apkInstaller plugin wrapper', () => {
  beforeEach(() => {
    mocks.installApk.mockClear();
    mocks.installApk.mockResolvedValue(undefined);
  });

  it('registers the ApkInstaller Capacitor plugin', () => {
    expect(registerPlugin).toHaveBeenCalledWith('ApkInstaller');
    expect(ApkInstaller).toBeDefined();
  });

  it('installApk calls the native plugin with the filePath option', async () => {
    await installApk('/data/user/0/com.taixiucanhan.app/files/update.apk');

    expect(mocks.installApk).toHaveBeenCalledWith({
      filePath: '/data/user/0/com.taixiucanhan.app/files/update.apk',
    });
  });

  it('installApk rejects empty filePath before calling the native plugin', async () => {
    await expect(installApk('')).rejects.toThrow('filePath is required');
    await expect(installApk('   ')).rejects.toThrow('filePath is required');

    expect(mocks.installApk).not.toHaveBeenCalled();
  });

  it('installApk rejects non-string filePath before calling the native plugin', async () => {
    await expect(installApk(undefined as unknown as string)).rejects.toThrow('filePath is required');

    expect(mocks.installApk).not.toHaveBeenCalled();
  });
});
