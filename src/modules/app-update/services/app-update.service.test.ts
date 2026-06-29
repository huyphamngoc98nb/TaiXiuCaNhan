import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { logger } from '@/core/telemetry/logger';
import {
  APP_UPDATE_ERROR_MESSAGES,
  checkForAndroidUpdate,
  clearSkippedVersion,
  getSkippedVersionCode,
  markVersionSkipped,
  parseAndroidLatestRelease,
} from './app-update.service';
import { getCurrentAndroidVersion } from './app-update.native';
import { DEFAULT_ANDROID_LATEST_JSON_URL } from '../app-update.config';

const preferencesMock = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
}));

const loggerMock = vi.hoisted(() => ({
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
}));

const currentVersionMock = vi.hoisted(() => vi.fn());

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: vi.fn() },
}));

vi.mock('@capacitor/preferences', () => ({
  Preferences: preferencesMock,
}));

vi.mock('@/core/telemetry/logger', () => ({ logger: loggerMock }));

vi.mock('./app-update.native', () => ({
  getCurrentAndroidVersion: currentVersionMock,
}));

function latestManifest(overrides: Record<string, unknown> = {}) {
  return {
    platform: 'android',
    versionName: '0.1.21',
    versionCode: 121,
    apkUrl: 'https://example.com/TaiChinhCaNhan-0.1.21.apk',
    sha256: 'abc123',
    ...overrides,
  };
}

function mockFetchJson(value: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      json: async () => value,
    })),
  );
}

describe('app update service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    vi.mocked(getCurrentAndroidVersion).mockResolvedValue({
      versionName: '0.1.20',
      versionCode: 120,
    });
    preferencesMock.get.mockResolvedValue({ value: null });
    mockFetchJson(latestManifest());
  });

  it('validates latest.json and applies optional defaults', () => {
    expect(parseAndroidLatestRelease(latestManifest())).toEqual({
      platform: 'android',
      versionName: '0.1.21',
      versionCode: 121,
      mandatory: false,
      apkUrl: 'https://example.com/TaiChinhCaNhan-0.1.21.apk',
      sha256: 'abc123',
      releaseNotes: [],
    });
  });

  it.each([
    ['missing platform', latestManifest({ platform: undefined })],
    ['wrong platform', latestManifest({ platform: 'ios' })],
    ['missing versionName', latestManifest({ versionName: undefined })],
    ['missing versionCode', latestManifest({ versionCode: undefined })],
    ['invalid versionCode', latestManifest({ versionCode: 0 })],
    ['missing apkUrl', latestManifest({ apkUrl: undefined })],
    ['missing sha256', latestManifest({ sha256: undefined })],
    ['invalid releaseNotes', latestManifest({ releaseNotes: ['valid', 42] })],
  ])('rejects invalid latest.json metadata: %s', (_caseName, manifest) => {
    expect(() => parseAndroidLatestRelease(manifest)).toThrow(
      APP_UPDATE_ERROR_MESSAGES.invalidManifest,
    );
  });

  it('returns update_available when latest versionCode is greater', async () => {
    await expect(checkForAndroidUpdate()).resolves.toMatchObject({
      status: 'update_available',
      currentVersionCode: 120,
      mandatory: false,
      latest: { versionCode: 121 },
    });
  });

  it.each([120, 119])(
    'returns up_to_date when latest versionCode is %s',
    async (latestVersionCode) => {
      mockFetchJson(latestManifest({ versionCode: latestVersionCode }));

      await expect(checkForAndroidUpdate()).resolves.toMatchObject({
        status: 'up_to_date',
        currentVersionCode: 120,
        latest: { versionCode: latestVersionCode },
      });
    },
  );

  it('returns unsupported_platform without fetching on web', async () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

    await expect(checkForAndroidUpdate()).resolves.toEqual({
      status: 'unsupported_platform',
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(getCurrentAndroidVersion).not.toHaveBeenCalled();
  });

  it('returns a safe error when the network request fails', async () => {
    const cause = new Error('offline');
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(cause)));

    await expect(checkForAndroidUpdate()).resolves.toMatchObject({
      status: 'error',
      message: APP_UPDATE_ERROR_MESSAGES.checkFailed,
      cause,
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('returns the invalid metadata message when response JSON is invalid', async () => {
    mockFetchJson(latestManifest({ sha256: undefined }));

    await expect(checkForAndroidUpdate()).resolves.toMatchObject({
      status: 'error',
      message: APP_UPDATE_ERROR_MESSAGES.invalidManifest,
    });
  });

  it('returns a clear error when current version cannot be resolved', async () => {
    vi.mocked(getCurrentAndroidVersion).mockRejectedValue(new Error('not available'));

    await expect(checkForAndroidUpdate()).resolves.toMatchObject({
      status: 'error',
      message: APP_UPDATE_ERROR_MESSAGES.currentVersionUnavailable,
    });
  });

  it('treats versions below minSupportedVersionCode as mandatory', async () => {
    mockFetchJson(latestManifest({ minSupportedVersionCode: 121 }));

    await expect(checkForAndroidUpdate()).resolves.toMatchObject({
      status: 'update_available',
      mandatory: true,
    });
  });

  it('uses the configured latest.json URL', async () => {
    vi.stubEnv('VITE_ANDROID_LATEST_JSON_URL', ' https://example.com/latest.json ');

    await checkForAndroidUpdate();

    expect(fetch).toHaveBeenCalledWith('https://example.com/latest.json', {
      cache: 'no-store',
    });
  });

  it('uses the documented manifest URL by default', async () => {
    await checkForAndroidUpdate();

    expect(fetch).toHaveBeenCalledWith(DEFAULT_ANDROID_LATEST_JSON_URL, {
      cache: 'no-store',
    });
  });

  it('stores and clears a skipped optional version', async () => {
    preferencesMock.get.mockResolvedValue({ value: '121' });

    await expect(getSkippedVersionCode()).resolves.toBe(121);
    await markVersionSkipped(121);
    expect(Preferences.set).toHaveBeenCalledWith({
      key: 'app_update.skipped_android_version_code',
      value: '121',
    });

    await clearSkippedVersion();
    expect(Preferences.remove).toHaveBeenCalledWith({
      key: 'app_update.skipped_android_version_code',
    });
  });
});
