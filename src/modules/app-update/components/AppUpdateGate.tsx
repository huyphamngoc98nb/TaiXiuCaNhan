import { useEffect, useRef } from 'react';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import {
  checkForAndroidUpdate,
  shouldPromptUpdate,
} from '../services/app-update.service';
import { useAppUpdatePrompt } from '../hooks/useAppUpdatePrompt';

export function AppUpdateGate() {
  const hasCheckedRef = useRef(false);
  const { showToast } = useToast();
  const { t } = useLanguage();
  const { promptForUpdate } = useAppUpdatePrompt();

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    let isMounted = true;

    async function checkUpdate() {
      try {
        const result = await checkForAndroidUpdate();
        if (!isMounted || !shouldPromptUpdate(result) || !result.latest) return;

        await promptForUpdate(result);
      } catch {
        if (isMounted) {
          showToast(t('app_update.checking_update_failed'), 'error');
        }
      }
    }

    void checkUpdate();

    return () => {
      isMounted = false;
    };
  }, [promptForUpdate, showToast, t]);

  return null;
}
