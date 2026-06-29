import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
  APP_UPDATE_PLUGIN_UNAVAILABLE_MESSAGE,
  getCurrentAndroidVersion,
  startAndroidUpdate,
} from './app-update.native';
import type { AndroidLatestRelease } from '../types/app-update.types';

const nativePluginMock = vi.hoisted(() => ({
  getCurrentVersion: vi.fn(),
  canInstallUnknownApps: vi.fn(),
  openInstallUnknownAppsSettings: vi.fn(),
  downloadAndInstallApk: vi.fn(),
  addListener: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(),
    isPluginAvailable: vi.fn(),
  },
  registerPlugin: vi.fn(() => nativePluginMock),
}));

vi.mock('@capacitor/app', () => ({
  App: { getInfo: vi.fn() },
}));

const latest: AndroidLatestRelease = {
  platform: 'android',
  versionName: '0.1.21 beta',
  versionCode: 121,
  mandatory: false,
  apkUrl: 'https://example.com/app.apk',
  sha256: 'abc123',
  releaseNotes: [],
};

describe('app update native bridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    vi.mocked(Capacitor.isPluginAvailable).mockReturnValue(false);
    vi.mocked(App.getInfo).mockResolvedValue({
      name: 'TaiChinhCaNhan',
      id: 'com.taixiucanhan.app',
      version: '0.1.20',
      build: '120',
    });
  });

  it('uses the future native plugin for the current version when available', async () => {
    vi.mocked(Capacitor.isPluginAvailable).mockReturnValue(true);
    nativePluginMock.getCurrentVersion.mockResolvedValue({
      versionName: '0.1.20',
      versionCode: 120,
    });

    await expect(getCurrentAndroidVersion()).resolves.toEqual({
      versionName: '0.1.20',
      versionCode: 120,
    });
  });

  it('uses the temporary Vite version fallback when the plugin is unavailable', async () => {
    vi.stubEnv('VITE_ANDROID_CURRENT_VERSION_NAME', '0.1.19');
    vi.stubEnv('VITE_ANDROID_CURRENT_VERSION_CODE', '119');

    await expect(getCurrentAndroidVersion()).resolves.toEqual({
      versionName: '0.1.19',
      versionCode: 119,
    });
    expect(App.getInfo).not.toHaveBeenCalled();
  });

  it('falls back to Capacitor App info for existing Android builds', async () => {
    await expect(getCurrentAndroidVersion()).resolves.toEqual({
      versionName: '0.1.20',
      versionCode: 120,
    });
  });

  it('fails gracefully until the native installer is available', async () => {
    await expect(startAndroidUpdate(latest)).rejects.toThrow(
      APP_UPDATE_PLUGIN_UNAVAILABLE_MESSAGE,
    );
    expect(nativePluginMock.downloadAndInstallApk).not.toHaveBeenCalled();
  });

  it('passes the APK contract to the future native installer', async () => {
    vi.mocked(Capacitor.isPluginAvailable).mockReturnValue(true);
    nativePluginMock.downloadAndInstallApk.mockResolvedValue({
      status: 'installer_opened',
    });

    await expect(startAndroidUpdate(latest)).resolves.toEqual({
      status: 'installer_opened',
    });

    expect(nativePluginMock.downloadAndInstallApk).toHaveBeenCalledWith({
      apkUrl: latest.apkUrl,
      expectedSha256: latest.sha256,
      fileName: 'TaiChinhCaNhan-0.1.21-beta.apk',
    });
  });

});
