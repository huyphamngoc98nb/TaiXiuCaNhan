export interface LatestAndroidRelease {
  platform: 'android';
  versionName: string;
  versionCode: number;
  minSupportedVersionCode?: number;
  mandatory?: boolean;
  apkUrl: string;
  sha256?: string;
  releaseDate?: string;
  releaseNotes?: string[];
}

export interface CurrentAppVersion {
  platform: 'android';
  versionName: string;
  versionCode: number;
  build: string;
}

export type AppUpdateCheckStatus =
  | 'unsupported-platform'
  | 'invalid-current-version'
  | 'manifest-unavailable'
  | 'up-to-date'
  | 'update-available';

export interface AppUpdateCheckResult {
  platform: string;
  current: CurrentAppVersion | null;
  latest: LatestAndroidRelease | null;
  updateAvailable: boolean;
  mandatory: boolean;
  skipped: boolean;
  status: AppUpdateCheckStatus;
}

export interface AndroidUpdateCheckOptions {
  ignoreSkipped?: boolean;
}
