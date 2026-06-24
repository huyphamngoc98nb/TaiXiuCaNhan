import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import type {
  AppUpdateCheckResult,
  AndroidUpdateCheckOptions,
  CurrentAppVersion,
  LatestAndroidRelease,
} from '../types/app-update.types';

export const DEFAULT_ANDROID_UPDATE_MANIFEST_URL =
  'https://github.com/huyphamngoc98nb/TaiChinhCaNhan/releases/latest/download/latest.json';

const SKIPPED_ANDROID_VERSION_CODE_KEY = 'app_update.skipped_android_version_code';

function getManifestUrl(): string {
  return (
    import.meta.env.VITE_ANDROID_UPDATE_MANIFEST_URL?.trim() ||
    DEFAULT_ANDROID_UPDATE_MANIFEST_URL
  );
}

function warnUpdateCheck(message: string, error?: unknown): void {
  console.warn(`[app-update] ${message}`, error ?? '');
}

function noUpdateResult(
  status: AppUpdateCheckResult['status'],
  platform = Capacitor.getPlatform(),
  current: CurrentAppVersion | null = null,
  latest: LatestAndroidRelease | null = null,
): AppUpdateCheckResult {
  return {
    platform,
    current,
    latest,
    updateAvailable: false,
    mandatory: false,
    skipped: false,
    status,
  };
}

function parseVersionCode(build: string | number | undefined): number | null {
  if (typeof build === 'number' && Number.isInteger(build) && build > 0) {
    return build;
  }

  if (typeof build === 'string' && /^\d+$/.test(build.trim())) {
    const value = Number(build.trim());
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  return null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function normalizeLatestAndroidRelease(value: unknown): LatestAndroidRelease | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const data = value as Record<string, unknown>;

  if (
    data.platform !== 'android' ||
    typeof data.versionName !== 'string' ||
    data.versionName.trim() === '' ||
    typeof data.versionCode !== 'number' ||
    !Number.isInteger(data.versionCode) ||
    data.versionCode <= 0 ||
    typeof data.apkUrl !== 'string' ||
    data.apkUrl.trim() === ''
  ) {
    return null;
  }

  if (
    data.minSupportedVersionCode !== undefined &&
    (typeof data.minSupportedVersionCode !== 'number' ||
      !Number.isInteger(data.minSupportedVersionCode) ||
      data.minSupportedVersionCode <= 0)
  ) {
    return null;
  }

  if (data.mandatory !== undefined && typeof data.mandatory !== 'boolean') {
    return null;
  }

  if (data.sha256 !== undefined && typeof data.sha256 !== 'string') {
    return null;
  }

  if (data.releaseDate !== undefined && typeof data.releaseDate !== 'string') {
    return null;
  }

  if (data.releaseNotes !== undefined && !isStringArray(data.releaseNotes)) {
    return null;
  }

  return {
    platform: 'android',
    versionName: data.versionName.trim(),
    versionCode: data.versionCode,
    minSupportedVersionCode: data.minSupportedVersionCode,
    mandatory: data.mandatory,
    apkUrl: data.apkUrl.trim(),
    sha256: data.sha256,
    releaseDate: data.releaseDate,
    releaseNotes: data.releaseNotes,
  };
}

export async function getCurrentAppVersion(): Promise<CurrentAppVersion | null> {
  if (Capacitor.getPlatform() !== 'android') {
    return null;
  }

  try {
    const info = await App.getInfo();
    const versionCode = parseVersionCode(info.build);

    if (versionCode === null) {
      warnUpdateCheck(`Could not parse Android build number: ${String(info.build)}`);
      return null;
    }

    return {
      platform: 'android',
      versionName: info.version,
      versionCode,
      build: String(info.build),
    };
  } catch (error) {
    warnUpdateCheck('Could not read current app version.', error);
    return null;
  }
}

export async function fetchLatestAndroidRelease(): Promise<LatestAndroidRelease | null> {
  try {
    const response = await fetch(getManifestUrl(), {
      cache: 'no-store',
    });

    if (!response.ok) {
      warnUpdateCheck(`Could not fetch Android update manifest: HTTP ${response.status}`);
      return null;
    }

    const manifest = normalizeLatestAndroidRelease(await response.json());

    if (!manifest) {
      warnUpdateCheck('Android update manifest is invalid.');
      return null;
    }

    return manifest;
  } catch (error) {
    warnUpdateCheck('Could not fetch Android update manifest.', error);
    return null;
  }
}

export async function getSkippedVersionCode(): Promise<number | null> {
  const { value } = await Preferences.get({ key: SKIPPED_ANDROID_VERSION_CODE_KEY });
  const versionCode = parseVersionCode(value ?? undefined);

  return versionCode;
}

export async function markVersionSkipped(versionCode: number): Promise<void> {
  if (!Number.isInteger(versionCode) || versionCode <= 0) {
    warnUpdateCheck(`Ignoring invalid skipped Android versionCode: ${String(versionCode)}`);
    return;
  }

  await Preferences.set({
    key: SKIPPED_ANDROID_VERSION_CODE_KEY,
    value: String(versionCode),
  });
}

export async function clearSkippedVersion(): Promise<void> {
  await Preferences.remove({ key: SKIPPED_ANDROID_VERSION_CODE_KEY });
}

export async function checkForAndroidUpdate(
  options: AndroidUpdateCheckOptions = {}
): Promise<AppUpdateCheckResult> {
  const platform = Capacitor.getPlatform();

  if (platform !== 'android') {
    return noUpdateResult('unsupported-platform', platform);
  }

  const current = await getCurrentAppVersion();
  if (!current) {
    return noUpdateResult('invalid-current-version', platform);
  }

  const latest = await fetchLatestAndroidRelease();
  if (!latest) {
    return noUpdateResult('manifest-unavailable', platform, current);
  }

  const updateAvailable = latest.versionCode > current.versionCode;
  const mandatory = latest.mandatory === true;
  const skippedVersionCode = options.ignoreSkipped ? null : await getSkippedVersionCode();
  const skipped =
    !options.ignoreSkipped && !mandatory && updateAvailable && skippedVersionCode === latest.versionCode;

  return {
    platform,
    current,
    latest,
    updateAvailable,
    mandatory,
    skipped,
    status: updateAvailable ? 'update-available' : 'up-to-date',
  };
}

export function shouldPromptUpdate(result: AppUpdateCheckResult): boolean {
  if (!result.updateAvailable) return false;
  if (result.mandatory) return true;

  return !result.skipped;
}
