import { registerPlugin } from '@capacitor/core';

export interface ApkInstallerPlugin {
  installApk(options: { filePath: string }): Promise<void>;
  checkInstallPermission(): Promise<{ granted: boolean }>;
  requestInstallPermission(): Promise<{ granted: boolean }>;
}

const ApkInstaller = registerPlugin<ApkInstallerPlugin>('ApkInstallerPlugin');

export async function installApk(filePath: string): Promise<void> {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new Error('filePath is required');
  }

  await ApkInstaller.installApk({ filePath });
}

export async function checkInstallPermission(): Promise<boolean> {
  const result = await ApkInstaller.checkInstallPermission();
  return result.granted;
}

export async function requestInstallPermission(): Promise<boolean> {
  const result = await ApkInstaller.requestInstallPermission();
  return result.granted;
}

export async function installApkWithPermissionCheck(filePath: string): Promise<void> {
  const granted = await checkInstallPermission();
  if (!granted) {
    const requested = await requestInstallPermission();
    if (!requested) {
      throw new Error('Install permission denied by user');
    }
  }

  await installApk(filePath);
}

export { ApkInstaller };
