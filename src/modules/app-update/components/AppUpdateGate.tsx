import { useEffect, useRef } from 'react';
import { AppUpdateDialog } from './AppUpdateDialog';
import { useAppUpdate } from '../hooks/useAppUpdate';

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
    hasCheckedRef.current = true;
    void checkForUpdate();
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
