import { useCallback } from 'react';
import { useConfirm } from '@/shared/components/ConfirmDialog/ConfirmContext';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import type { TranslationPath } from '@/shared/constants/translations';
import { markVersionSkipped } from '../services/app-update.service';
import type { AppUpdateCheckResult } from '../types/app-update.types';

interface PromptUpdateOptions {
  markSkippedOnLater?: boolean;
}

function formatUpdateMessage(
  result: AppUpdateCheckResult,
  t: (path: TranslationPath) => string
): string {
  const lines = [
    result.mandatory
      ? t('app_update.mandatory_message')
      : t('app_update.update_available_message'),
  ];

  if (result.current && result.latest) {
    lines.push(
      '',
      `${t('app_update.current_version')}: ${result.current.versionName} (${result.current.versionCode})`,
      `${t('app_update.latest_version')}: ${result.latest.versionName} (${result.latest.versionCode})`,
    );
  }

  const releaseNotes = result.latest?.releaseNotes?.filter((note) => note.trim() !== '') ?? [];
  if (releaseNotes.length > 0) {
    lines.push('', `${t('app_update.release_notes')}:`, ...releaseNotes.map((note) => `- ${note}`));
  }

  return lines.join('\n');
}

function openUpdateUrl(url: string): void {
  const opened = window.open(url, '_system', 'noopener,noreferrer');

  if (!opened) {
    window.location.href = url;
  }
}

export function useAppUpdatePrompt() {
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const promptForUpdate = useCallback(
    async (
      result: AppUpdateCheckResult,
      options: PromptUpdateOptions = {}
    ): Promise<boolean> => {
      if (!result.latest || !result.updateAvailable) return false;

      const accepted = await confirm({
        title: result.mandatory
          ? t('app_update.mandatory_title')
          : t('app_update.update_available_title'),
        message: formatUpdateMessage(result, t),
        confirmText: t('app_update.update_now'),
        cancelText: result.mandatory ? undefined : t('app_update.later'),
        hideCancel: result.mandatory,
      });

      if (accepted) {
        try {
          openUpdateUrl(result.latest.apkUrl);
        } catch {
          showToast(t('app_update.open_update_failed'), 'error');
        }
        return true;
      }

      if (!result.mandatory && options.markSkippedOnLater !== false) {
        await markVersionSkipped(result.latest.versionCode);
      }

      return false;
    },
    [confirm, showToast, t],
  );

  return { promptForUpdate };
}
