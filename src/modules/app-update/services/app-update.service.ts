import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { logger } from '@/core/telemetry/logger';
import { getAndroidLatestJsonUrl } from '../app-update.config';
import {
  assertAllowedApkUrl,
  assertAllowedManifestUrl,
} from '../app-update.security';
import { getCurrentAndroidVersion } from './app-update.native';
import type {
  AndroidLatestRelease,
  AppUpdateCheckResult,
} from '../types/app-update.types';

const SKIPPED_ANDROID_VERSION_CODE_KEY = 'app_update.skipped_android_version_code';
export const APP_UPDATE_AUTO_CHECK_ENABLED_KEY = 'app_update_auto_check_enabled';

export const APP_UPDATE_ERROR_MESSAGES = {
  checkFailed: 'Không thể kiểm tra cập nhật. Vui lòng thử lại sau.',
  invalidManifest: 'Dữ liệu phiên bản mới không hợp lệ.',
  currentVersionUnavailable:
    'Không xác định được phiên bản hiện tại của ứng dụng.',
} as const;

class AppUpdateManifestError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AppUpdateManifestError';
    this.cause = cause;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}

function optionalTrimmedString(value: unknown): string | undefined | null {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function parseAndroidLatestRelease(value: unknown): AndroidLatestRelease {
  if (!isRecord(value)) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.invalidManifest);
  }

  const versionName = optionalTrimmedString(value.versionName);
  const apkUrl = optionalTrimmedString(value.apkUrl);
  const sha256 = optionalTrimmedString(value.sha256);
  const releaseDate = optionalTrimmedString(value.releaseDate);

  const invalidRequiredFields =
    value.platform !== 'android' ||
    !versionName ||
    !isPositiveInteger(value.versionCode) ||
    !apkUrl ||
    !sha256;
  const invalidOptionalFields =
    (value.minSupportedVersionCode !== undefined &&
      !isPositiveInteger(value.minSupportedVersionCode)) ||
    (value.mandatory !== undefined && typeof value.mandatory !== 'boolean') ||
    releaseDate === null ||
    (value.releaseNotes !== undefined &&
      (!Array.isArray(value.releaseNotes) ||
        !value.releaseNotes.every((note) => typeof note === 'string')));

  if (invalidRequiredFields || invalidOptionalFields) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.invalidManifest);
  }

  const versionCode = value.versionCode as number;
  const minSupportedVersionCode = value.minSupportedVersionCode as number | undefined;
  const mandatory = value.mandatory as boolean | undefined;
  const releaseNotes = value.releaseNotes as string[] | undefined;

  try {
    assertAllowedApkUrl(apkUrl);
  } catch (cause) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.invalidManifest, cause);
  }

  return {
    platform: 'android',
    versionName,
    versionCode,
    ...(minSupportedVersionCode !== undefined
      ? { minSupportedVersionCode }
      : {}),
    mandatory: mandatory ?? false,
    apkUrl,
    sha256,
    ...(releaseDate ? { releaseDate } : {}),
    releaseNotes: (releaseNotes ?? []).map((note) => note.trim()),
  };
}

export async function fetchLatestAndroidRelease(): Promise<AndroidLatestRelease> {
  const manifestUrl = getAndroidLatestJsonUrl();

  try {
    assertAllowedManifestUrl(manifestUrl);
  } catch (cause) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.invalidManifest, cause);
  }

  const response = await fetch(manifestUrl, {
    cache: 'no-store',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  });
  if (!response.ok) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.checkFailed);
  }

  let value: unknown;
  try {
    value = await response.json();
  } catch (cause) {
    throw new AppUpdateManifestError(APP_UPDATE_ERROR_MESSAGES.invalidManifest, cause);
  }

  return parseAndroidLatestRelease(value);
}

export async function checkForAndroidUpdate(): Promise<AppUpdateCheckResult> {
  if (Capacitor.getPlatform() !== 'android') {
    return { status: 'unsupported_platform' };
  }

  try {
    const latest = await fetchLatestAndroidRelease();

    let current;
    try {
      current = await getCurrentAndroidVersion();
    } catch (cause) {
      return {
        status: 'error',
        message: APP_UPDATE_ERROR_MESSAGES.currentVersionUnavailable,
        cause,
      };
    }

    if (latest.versionCode > current.versionCode) {
      return {
        status: 'update_available',
        latest,
        currentVersionCode: current.versionCode,
        mandatory:
          latest.mandatory ||
          (latest.minSupportedVersionCode !== undefined &&
            current.versionCode < latest.minSupportedVersionCode),
      };
    }

    return {
      status: 'up_to_date',
      latest,
      currentVersionCode: current.versionCode,
    };
  } catch (cause) {
    const message =
      cause instanceof AppUpdateManifestError
        ? cause.message
        : APP_UPDATE_ERROR_MESSAGES.checkFailed;

    logger.warn('Android update check failed.', cause, {
      context: 'AppUpdate.check',
      metadata: {
        manifestUrl: getAndroidLatestJsonUrl(),
        platform: Capacitor.getPlatform(),
      },
    });

    return { status: 'error', message, cause };
  }
}

export async function getSkippedVersionCode(): Promise<number | null> {
  const { value } = await Preferences.get({ key: SKIPPED_ANDROID_VERSION_CODE_KEY });
  const versionCode = Number(value);
  return Number.isSafeInteger(versionCode) && versionCode > 0 ? versionCode : null;
}

export async function markVersionSkipped(versionCode: number): Promise<void> {
  if (!Number.isSafeInteger(versionCode) || versionCode <= 0) return;

  await Preferences.set({
    key: SKIPPED_ANDROID_VERSION_CODE_KEY,
    value: String(versionCode),
  });
}

export async function clearSkippedVersion(): Promise<void> {
  await Preferences.remove({ key: SKIPPED_ANDROID_VERSION_CODE_KEY });
}

export async function getAppUpdateAutoCheckEnabled(): Promise<boolean> {
  const { value } = await Preferences.get({
    key: APP_UPDATE_AUTO_CHECK_ENABLED_KEY,
  });

  if (value === 'false') return false;
  return true;
}

export async function setAppUpdateAutoCheckEnabled(enabled: boolean): Promise<void> {
  await Preferences.set({
    key: APP_UPDATE_AUTO_CHECK_ENABLED_KEY,
    value: String(enabled),
  });
}
