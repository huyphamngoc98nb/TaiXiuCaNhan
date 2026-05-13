import { registerPlugin } from '@capacitor/core';

export interface ApkInstallerPlugin {
  installApk(options: { filePath: string }): Promise<void>;
}

const ApkInstaller = registerPlugin<ApkInstallerPlugin>('ApkInstaller');

export async function installApk(filePath: string): Promise<void> {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw new Error('filePath is required');
  }

  await ApkInstaller.installApk({ filePath });
}

export { ApkInstaller };
