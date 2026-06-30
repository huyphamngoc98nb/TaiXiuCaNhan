import { App } from '@capacitor/app';
import {
  Capacitor,
  registerPlugin,
  type PluginListenerHandle,
} from '@capacitor/core';
import { getFallbackAndroidVersion } from '../app-update.config';
import type {
  AndroidCurrentVersion,
  AndroidLatestRelease,
  AppUpdateCacheCleanupOptions,
  AppUpdateCacheCleanupResult,
  AppUpdateDownloadOptions,
  AppUpdateDownloadProgress,
  AppUpdateDownloadResult,
  CurrentAndroidVersion,
  InstallUnknownAppsPermission,
} from '../types/app-update.types';

export interface AppUpdatePlugin {
  getCurrentVersion(): Promise<CurrentAndroidVersion>;
  canInstallUnknownApps(): Promise<InstallUnknownAppsPermission>;
  openInstallUnknownAppsSettings(): Promise<void>;
  cleanupUpdateCache(
    options?: AppUpdateCacheCleanupOptions,
  ): Promise<AppUpdateCacheCleanupResult>;
  downloadAndInstallApk(
    options: AppUpdateDownloadOptions,
  ): Promise<AppUpdateDownloadResult>;
  addListener(
    eventName: 'appUpdateDownloadProgress',
    listenerFunc: (event: AppUpdateDownloadProgress) => void,
  ): Promise<PluginListenerHandle>;
}

export const APP_UPDATE_PLUGIN_UNAVAILABLE_MESSAGE =
  'Tính năng tải và cài đặt APK chưa khả dụng trên thiết bị này.';

export class AppUpdatePluginUnavailableError extends Error {
  constructor() {
    super(APP_UPDATE_PLUGIN_UNAVAILABLE_MESSAGE);
    this.name = 'AppUpdatePluginUnavailableError';
  }
}

export const AppUpdatePlugin = registerPlugin<AppUpdatePlugin>('AppUpdatePlugin');

export async function cleanupAndroidUpdateCache(
  options: AppUpdateCacheCleanupOptions = {},
): Promise<number> {
  if (
    Capacitor.getPlatform() !== 'android' ||
    !Capacitor.isPluginAvailable('AppUpdatePlugin')
  ) {
    return 0;
  }

  const result = await AppUpdatePlugin.cleanupUpdateCache(options);
  return Number.isSafeInteger(result.deletedCount) && result.deletedCount >= 0
    ? result.deletedCount
    : 0;
}

export async function addAppUpdateDownloadProgressListener(
  listener: (event: AppUpdateDownloadProgress) => void,
): Promise<PluginListenerHandle> {
  if (
    Capacitor.getPlatform() !== 'android' ||
    !Capacitor.isPluginAvailable('AppUpdatePlugin')
  ) {
    throw new AppUpdatePluginUnavailableError();
  }

  return AppUpdatePlugin.addListener('appUpdateDownloadProgress', listener);
}

function normalizeCurrentVersion(value: AndroidCurrentVersion): AndroidCurrentVersion | null {
  if (!Number.isSafeInteger(value.versionCode) || value.versionCode <= 0) return null;

  const versionName = value.versionName?.trim();
  return {
    versionCode: value.versionCode,
    ...(versionName ? { versionName } : {}),
  };
}

export async function getCurrentAndroidVersion(): Promise<AndroidCurrentVersion> {
  if (Capacitor.getPlatform() !== 'android') {
    throw new Error('Không xác định được phiên bản hiện tại của ứng dụng.');
  }

  if (Capacitor.isPluginAvailable('AppUpdatePlugin')) {
    try {
      const nativeVersion = normalizeCurrentVersion(
        await AppUpdatePlugin.getCurrentVersion(),
      );
      if (nativeVersion) return nativeVersion;
    } catch {
      // Compatibility fallbacks keep version checks safe if plugin registration fails.
    }
  }

  const configuredVersion = getFallbackAndroidVersion();
  if (configuredVersion.versionCode !== undefined) {
    return {
      versionCode: configuredVersion.versionCode,
      ...(configuredVersion.versionName
        ? { versionName: configuredVersion.versionName }
        : {}),
    };
  }

  try {
    const appInfo = await App.getInfo();
    const current = normalizeCurrentVersion({
      versionCode: Number(appInfo.build),
      versionName: appInfo.version,
    });
    if (current) return current;
  } catch {
    // The clear error below is returned to the UI by checkForAndroidUpdate().
  }

  throw new Error('Không xác định được phiên bản hiện tại của ứng dụng.');
}

function safeVersionName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

export async function startAndroidUpdate(
  latest: AndroidLatestRelease,
): Promise<AppUpdateDownloadResult> {
  if (
    Capacitor.getPlatform() !== 'android' ||
    !Capacitor.isPluginAvailable('AppUpdatePlugin')
  ) {
    throw new AppUpdatePluginUnavailableError();
  }

  return AppUpdatePlugin.downloadAndInstallApk({
    apkUrl: latest.apkUrl,
    expectedSha256: latest.sha256,
    fileName: `TaiChinhCaNhan-${safeVersionName(latest.versionName)}.apk`,
  });
}
