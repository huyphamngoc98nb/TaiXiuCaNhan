import { useEffect, useRef } from 'react';
import { logger } from '@/core/telemetry/logger';
import { AppUpdateDialog } from './AppUpdateDialog';
import { useAppUpdate } from '../hooks/useAppUpdate';
import { cleanupAndroidUpdateCache } from '../services/app-update.native';
import { getAppUpdateAutoCheckEnabled } from '../services/app-update.service';

export function AppUpdateGate() {
  const hasCheckedRef = useRef(false);
  const {
    availableUpdate,
    beginUpdate,
    checkForUpdate,
    dismissUpdate,
    downloadProgress,
    installState,
    isUpdating,
    updateError,
  } = useAppUpdate();

  useEffect(() => {
    if (hasCheckedRef.current) return;

    void cleanupAndroidUpdateCache({ maxAgeHours: 24 }).catch((error) => {
      logger.warn('Android update cache cleanup failed.', error, {
        context: 'AppUpdateGate.cleanup',
      });
    });

    let active = true;

    async function checkIfEnabled() {
      let enabled = true;
      try {
        enabled = await getAppUpdateAutoCheckEnabled();
      } catch {
        // The setting defaults to enabled when local preferences are unavailable.
      }

      if (!active || hasCheckedRef.current) return;
      hasCheckedRef.current = true;
      if (enabled) void checkForUpdate();
    }

    void checkIfEnabled();

    return () => {
      active = false;
    };
  }, [checkForUpdate]);

  if (!availableUpdate) return null;

  return (
    <AppUpdateDialog
      latest={availableUpdate.latest}
      currentVersionCode={availableUpdate.currentVersionCode}
      mandatory={availableUpdate.mandatory}
      installState={installState}
      isUpdating={isUpdating}
      progress={downloadProgress}
      error={updateError}
      onUpdate={() => void beginUpdate()}
      onDismiss={() => void dismissUpdate()}
    />
  );
}
