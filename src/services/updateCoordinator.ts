import { App } from '@capacitor/app';
import { getDbConnection } from '@/core/db/sqlite/connection';
import { logger } from '@/core/telemetry/logger';
import versionConfig from '../../version.config.json';

const LAST_CHECK_KEY = 'lastCheckAt';
const UPDATE_CHECK_THROTTLE_MS = 86_400_000;
const BUNDLE_UPDATE_ENDPOINT = '/api/updates/bundle/latest';

export type UpdateStrategy = 'B' | 'A' | 'none';

export interface UpdateResult {
  strategy: UpdateStrategy;
  status: 'bundle_available' | 'native_required' | 'up_to_date' | 'throttled' | 'api_error';
  data?: unknown;
}

export interface UpdateCoordinator {
  checkAndUpdate(): Promise<UpdateResult>;
}

interface BundleCheckResponse {
  hasUpdate: boolean;
  nativeRequired: unknown | null;
  update: unknown | null;
}

interface ConfigRow {
  value?: unknown;
}

function isBundleCheckResponse(value: unknown): value is BundleCheckResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;
  return (
    typeof response.hasUpdate === 'boolean' &&
    'nativeRequired' in response &&
    'update' in response
  );
}

async function ensureAppConfigTable(): Promise<void> {
  const db = await getDbConnection();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
}

async function getConfig(key: string): Promise<string | null> {
  await ensureAppConfigTable();

  const db = await getDbConnection();
  const result = await db.query('SELECT value FROM app_config WHERE key = ?', [key]);
  const row = result.values?.[0] as ConfigRow | undefined;

  return typeof row?.value === 'string' ? row.value : null;
}

async function setConfig(key: string, value: string): Promise<void> {
  await ensureAppConfigTable();

  const db = await getDbConnection();
  await db.run('INSERT OR REPLACE INTO app_config (key, value) VALUES (?, ?)', [key, value]);
}

function logResult(result: UpdateResult, durationMs: number, bundleVersion?: string): void {
  const bundleSegment = bundleVersion ? ` bundleVersion=${bundleVersion}` : '';
  logger.info(
    `[UpdateCoordinator] strategy=${result.strategy} status=${result.status}${bundleSegment} duration=${durationMs}ms`,
  );
}

function toApiError(startMs: number, bundleVersion?: string): UpdateResult {
  const result: UpdateResult = { strategy: 'none', status: 'api_error' };
  logResult(result, Date.now() - startMs, bundleVersion);
  return result;
}

/**
 * Checks the OTA Bundle API once per 24 hours, stores the successful check time,
 * and returns the next update strategy for native or bundle update flows.
 */
async function checkAndUpdate(): Promise<UpdateResult> {
  const startMs = Date.now();
  const now = startMs;
  const bundleVersion = versionConfig.bundleVersion;

  try {
    const lastCheckAt = Number(await getConfig(LAST_CHECK_KEY));
    if (Number.isFinite(lastCheckAt) && now - lastCheckAt < UPDATE_CHECK_THROTTLE_MS) {
      const result: UpdateResult = { strategy: 'none', status: 'throttled' };
      logResult(result, Date.now() - startMs, bundleVersion);
      return result;
    }

    const appInfo = await App.getInfo();
    const response = await fetch(BUNDLE_UPDATE_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-native-version': appInfo.version,
        'x-bundle-version': bundleVersion,
      },
    });

    if (!response.ok) {
      return toApiError(startMs, bundleVersion);
    }

    const data: unknown = await response.json();
    if (!isBundleCheckResponse(data)) {
      return toApiError(startMs, bundleVersion);
    }

    await setConfig(LAST_CHECK_KEY, String(now));

    let result: UpdateResult;
    if (data.nativeRequired !== null) {
      result = { strategy: 'A', status: 'native_required', data };
    } else if (data.hasUpdate) {
      result = { strategy: 'B', status: 'bundle_available', data };
    } else {
      result = { strategy: 'none', status: 'up_to_date' };
    }

    logResult(result, Date.now() - startMs, bundleVersion);
    return result;
  } catch {
    return toApiError(startMs, bundleVersion);
  }
}

export const updateCoordinator: UpdateCoordinator = { checkAndUpdate };
