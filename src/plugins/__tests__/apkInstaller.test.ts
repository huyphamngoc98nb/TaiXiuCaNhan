import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerPlugin } from '@capacitor/core';
import {
  ApkInstaller,
  checkInstallPermission,
  installApk,
  installApkWithPermissionCheck,
  requestInstallPermission,
} from '@/plugins/apkInstaller';

const mocks = vi.hoisted(() => ({
  checkInstallPermission: vi.fn(),
  installApk: vi.fn(),
  registerPlugin: vi.fn(),
  requestInstallPermission: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  registerPlugin: mocks.registerPlugin.mockReturnValue({
    checkInstallPermission: mocks.checkInstallPermission,
    installApk: mocks.installApk,
    requestInstallPermission: mocks.requestInstallPermission,
  }),
}));

describe('apkInstaller plugin wrapper', () => {
  beforeEach(() => {
    mocks.checkInstallPermission.mockReset();
    mocks.installApk.mockClear();
    mocks.installApk.mockResolvedValue(undefined);
    mocks.requestInstallPermission.mockReset();
  });

  it('registers the ApkInstallerPlugin Capacitor plugin', () => {
    expect(registerPlugin).toHaveBeenCalledWith('ApkInstallerPlugin');
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

  it('checkInstallPermission returns true when the native plugin grants permission', async () => {
    mocks.checkInstallPermission.mockResolvedValue({ granted: true });

    await expect(checkInstallPermission()).resolves.toBe(true);
  });

  it('checkInstallPermission returns false when the native plugin denies permission', async () => {
    mocks.checkInstallPermission.mockResolvedValue({ granted: false });

    await expect(checkInstallPermission()).resolves.toBe(false);
  });

  it('requestInstallPermission returns true when the native plugin grants permission', async () => {
    mocks.requestInstallPermission.mockResolvedValue({ granted: true });

    await expect(requestInstallPermission()).resolves.toBe(true);
  });

  it('requestInstallPermission returns false when the native plugin denies permission', async () => {
    mocks.requestInstallPermission.mockResolvedValue({ granted: false });

    await expect(requestInstallPermission()).resolves.toBe(false);
  });

  it('installApkWithPermissionCheck installs immediately when permission is already granted', async () => {
    const filePath = '/data/user/0/com.taixiucanhan.app/files/update.apk';
    mocks.checkInstallPermission.mockResolvedValue({ granted: true });

    await installApkWithPermissionCheck(filePath);

    expect(mocks.requestInstallPermission).not.toHaveBeenCalled();
    expect(mocks.installApk).toHaveBeenCalledTimes(1);
    expect(mocks.installApk).toHaveBeenCalledWith({ filePath });
  });

  it('installApkWithPermissionCheck requests permission before installing when needed', async () => {
    const filePath = '/data/user/0/com.taixiucanhan.app/files/update.apk';
    mocks.checkInstallPermission.mockResolvedValue({ granted: false });
    mocks.requestInstallPermission.mockResolvedValue({ granted: true });

    await installApkWithPermissionCheck(filePath);

    expect(mocks.requestInstallPermission).toHaveBeenCalledTimes(1);
    expect(mocks.installApk).toHaveBeenCalledTimes(1);
    expect(mocks.installApk).toHaveBeenCalledWith({ filePath });
  });

  it('installApkWithPermissionCheck rejects when the user denies install permission', async () => {
    const filePath = '/data/user/0/com.taixiucanhan.app/files/update.apk';
    mocks.checkInstallPermission.mockResolvedValue({ granted: false });
    mocks.requestInstallPermission.mockResolvedValue({ granted: false });

    await expect(installApkWithPermissionCheck(filePath)).rejects.toThrow(
      'Install permission denied by user',
    );

    expect(mocks.installApk).not.toHaveBeenCalled();
  });
});
