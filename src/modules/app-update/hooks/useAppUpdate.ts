import { useCallback, useEffect, useRef, useState } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';
import { useLanguage } from '@/shared/context/LanguageContext';
import { getAppUpdateErrorMessage, getAppUpdateNativeErrorCode } from '../app-update.errors';
import {
  APP_UPDATE_ERROR_MESSAGES,
  checkForAndroidUpdate,
  getSkippedVersionCode,
  markVersionSkipped,
} from '../services/app-update.service';
import {
  addAppUpdateDownloadProgressListener,
  startAndroidUpdate,
} from '../services/app-update.native';
import type {
  AndroidLatestRelease,
  AppUpdateCheckResult,
  AppUpdateDownloadProgress,
  UpdateInstallState,
} from '../types/app-update.types';

type AvailableUpdate = Extract<AppUpdateCheckResult, { status: 'update_available' }>;

type UseAppUpdateOptions = {
  respectSkippedVersion?: boolean;
};

function normalizeProgress(progress: AppUpdateDownloadProgress): AppUpdateDownloadProgress {
  const bytesDownloaded = Number.isFinite(progress.bytesDownloaded)
    ? Math.max(0, progress.bytesDownloaded)
    : 0;
  const totalBytes = Number.isFinite(progress.totalBytes) && progress.totalBytes >= 0
    ? progress.totalBytes
    : -1;
  const percent = Number.isFinite(progress.percent) && progress.percent >= 0
    ? Math.min(100, Math.round(progress.percent))
    : -1;

  return { bytesDownloaded, totalBytes, percent };
}

function isInstallActive(state: UpdateInstallState): boolean {
  return state === 'downloading' ||
    state === 'verifying' ||
    state === 'opening_installer';
}

export function useAppUpdate({
  respectSkippedVersion = true,
}: UseAppUpdateOptions = {}) {
  const { t } = useLanguage();
  const [availableUpdate, setAvailableUpdate] = useState<AvailableUpdate | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [installState, setInstallState] = useState<UpdateInstallState>('idle');
  const [downloadProgress, setDownloadProgress] =
    useState<AppUpdateDownloadProgress | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const progressListenerRef = useRef<PluginListenerHandle | null>(null);
  const installInFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const removeProgressListener = useCallback(async () => {
    const listener = progressListenerRef.current;
    progressListenerRef.current = null;
    if (!listener) return;

    try {
      await listener.remove();
    } catch {
      // Listener cleanup is best-effort and must not mask update results.
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void removeProgressListener();
    };
  }, [removeProgressListener]);

  const resetInstallState = useCallback(() => {
    setInstallState('idle');
    setDownloadProgress(null);
    setUpdateError(null);
  }, []);

  const checkForUpdate = useCallback(async (): Promise<AppUpdateCheckResult> => {
    setIsChecking(true);
    resetInstallState();

    try {
      const result = await checkForAndroidUpdate();

      if (result.status !== 'update_available') {
        setAvailableUpdate(null);
        return result;
      }

      const skippedVersionCode =
        respectSkippedVersion && !result.mandatory
          ? await getSkippedVersionCode()
          : null;

      setAvailableUpdate(
        skippedVersionCode === result.latest.versionCode ? null : result,
      );
      return result;
    } catch (cause) {
      setAvailableUpdate(null);
      return {
        status: 'error',
        message: APP_UPDATE_ERROR_MESSAGES.checkFailed,
        cause,
      };
    } finally {
      setIsChecking(false);
    }
  }, [resetInstallState, respectSkippedVersion]);

  const dismissUpdate = useCallback(async () => {
    if (!availableUpdate || availableUpdate.mandatory || installInFlightRef.current) return;

    setAvailableUpdate(null);
    resetInstallState();

    try {
      await markVersionSkipped(availableUpdate.latest.versionCode);
    } catch {
      // Dismissing an optional prompt must never block or crash the app.
    }
  }, [availableUpdate, resetInstallState]);

  const beginUpdate = useCallback(async () => {
    if (!availableUpdate || installInFlightRef.current) return;

    installInFlightRef.current = true;
    setInstallState('downloading');
    setDownloadProgress(null);
    setUpdateError(null);

    try {
      const listener = await addAppUpdateDownloadProgressListener((event) => {
        if (!mountedRef.current) return;

        const progress = normalizeProgress(event);
        setDownloadProgress(progress);
        setInstallState(progress.percent >= 100 ? 'verifying' : 'downloading');
      });

      if (!mountedRef.current) {
        await listener.remove();
        return;
      }
      progressListenerRef.current = listener;

      const result = await startAndroidUpdate(availableUpdate.latest);
      if (mountedRef.current && result.status === 'installer_opened') {
        setInstallState('installer_opened');
      }
    } catch (error) {
      if (mountedRef.current) {
        setInstallState(
          getAppUpdateNativeErrorCode(error) === 'APP_UPDATE_INSTALL_PERMISSION_REQUIRED'
            ? 'permission_required'
            : 'error',
        );
        setUpdateError(getAppUpdateErrorMessage(error, t));
      }
    } finally {
      await removeProgressListener();
      installInFlightRef.current = false;
    }
  }, [availableUpdate, removeProgressListener, t]);

  return {
    availableUpdate,
    beginUpdate,
    checkForUpdate,
    dismissUpdate,
    downloadProgress,
    installState,
    isChecking,
    isUpdating: isInstallActive(installState),
    updateError,
  };
}

export type { AndroidLatestRelease };
