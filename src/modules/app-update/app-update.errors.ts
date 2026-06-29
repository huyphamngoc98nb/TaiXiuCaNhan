import type { TranslationPath } from '@/shared/constants/translations';
import { AppUpdatePluginUnavailableError } from './services/app-update.native';
import type { AppUpdateNativeErrorCode } from './types/app-update.types';

type Translate = (path: TranslationPath) => string;

const APP_UPDATE_NATIVE_ERROR_CODES: ReadonlySet<AppUpdateNativeErrorCode> = new Set([
  'APP_UPDATE_INVALID_INPUT',
  'APP_UPDATE_DOWNLOAD_FAILED',
  'APP_UPDATE_SHA256_MISMATCH',
  'APP_UPDATE_FILE_PROVIDER_FAILED',
  'APP_UPDATE_INSTALL_PERMISSION_REQUIRED',
  'APP_UPDATE_INSTALL_INTENT_FAILED',
  'APP_UPDATE_UNKNOWN_ERROR',
]);

const ERROR_TRANSLATION_KEYS: Record<AppUpdateNativeErrorCode, TranslationPath> = {
  APP_UPDATE_INVALID_INPUT: 'app_update.invalid_input',
  APP_UPDATE_DOWNLOAD_FAILED: 'app_update.download_failed',
  APP_UPDATE_SHA256_MISMATCH: 'app_update.sha256_mismatch',
  APP_UPDATE_FILE_PROVIDER_FAILED: 'app_update.file_provider_failed',
  APP_UPDATE_INSTALL_PERMISSION_REQUIRED: 'app_update.install_permission_required',
  APP_UPDATE_INSTALL_INTENT_FAILED: 'app_update.install_intent_failed',
  APP_UPDATE_UNKNOWN_ERROR: 'app_update.unknown_error',
};

export function getAppUpdateNativeErrorCode(
  error: unknown,
): AppUpdateNativeErrorCode | null {
  if (!error || typeof error !== 'object' || !('code' in error)) return null;

  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' &&
    APP_UPDATE_NATIVE_ERROR_CODES.has(code as AppUpdateNativeErrorCode)
    ? (code as AppUpdateNativeErrorCode)
    : null;
}

export function getAppUpdateErrorMessage(error: unknown, t: Translate): string {
  if (error instanceof AppUpdatePluginUnavailableError) {
    return t('app_update.install_unavailable');
  }

  const code = getAppUpdateNativeErrorCode(error);
  return t(code ? ERROR_TRANSLATION_KEYS[code] : 'app_update.unknown_error');
}
