import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { useLanguage } from '@/shared/context/LanguageContext';
import type {
  AndroidLatestRelease,
  AppUpdateDownloadProgress,
  UpdateInstallState,
} from '../types/app-update.types';
import '@/shared/components/ConfirmDialog/ConfirmDialog.css';
import './AppUpdateDialog.css';

type AppUpdateDialogProps = {
  latest: AndroidLatestRelease;
  currentVersionCode: number;
  mandatory: boolean;
  installState: UpdateInstallState;
  isUpdating: boolean;
  progress: AppUpdateDownloadProgress | null;
  error: string | null;
  onUpdate: () => void;
  onDismiss: () => void;
};

export function AppUpdateDialog({
  latest,
  currentVersionCode,
  mandatory,
  installState,
  isUpdating,
  progress,
  error,
  onUpdate,
  onDismiss,
}: AppUpdateDialogProps) {
  const { t } = useLanguage();
  const releaseNotes = (latest.releaseNotes ?? []).filter((note) => note.trim() !== '');
  const isRetry = installState === 'error' || installState === 'permission_required';
  useBodyScrollLock(true);

  return (
    <div
      className="confirm-overlay"
      onClick={mandatory || isUpdating ? undefined : onDismiss}
    >
      <section
        className="confirm-dialog app-update-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-update-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-content app-update-content">
          <h2 id="app-update-title" className="confirm-title">
            {t('app_update.update_available_title')}
          </h2>

          <p className="app-update-version">
            {t('app_update.latest_version')}: {latest.versionName} ({latest.versionCode})
          </p>
          <p className="app-update-current-version">
            {t('app_update.current_version_code')}: {currentVersionCode}
          </p>

          {mandatory && (
            <p className="app-update-mandatory">
              {t('app_update.mandatory_message')}
            </p>
          )}

          {releaseNotes.length > 0 && (
            <div className="app-update-notes">
              <h3>{t('app_update.release_notes')}</h3>
              <ul>
                {releaseNotes.map((note, index) => (
                  <li key={`${index}-${note}`}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {isUpdating && (
            <div className="app-update-progress" aria-live="polite">
              <div className="app-update-progress-label">
                <span>
                  {installState === 'verifying'
                    ? t('app_update.verifying')
                    : t('app_update.downloading')}
                </span>
                {progress && progress.percent >= 0 && <strong>{progress.percent}%</strong>}
              </div>

              {progress && progress.percent >= 0 ? (
                <div
                  className="app-update-progress-track"
                  role="progressbar"
                  aria-label={t('app_update.downloading')}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress.percent}
                >
                  <div
                    className="app-update-progress-value"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              ) : (
                <div className="app-update-progress-indeterminate" role="status" />
              )}

              {progress && progress.percent < 0 && (
                <p className="app-update-progress-bytes">
                  {t('app_update.downloaded')}: {formatBytes(progress.bytesDownloaded)}
                </p>
              )}
            </div>
          )}

          {installState === 'installer_opened' && (
            <p className="app-update-success" role="status">
              {t('app_update.installer_opened')}
            </p>
          )}

          {error && <p className="app-update-error" role="alert">{error}</p>}
        </div>

        <div className="confirm-actions">
          {!mandatory && (
            <button
              type="button"
              className="confirm-button"
              onClick={onDismiss}
              disabled={isUpdating}
            >
              {t('app_update.later')}
            </button>
          )}
          <button
            type="button"
            className="confirm-button app-update-primary-button"
            onClick={onUpdate}
            disabled={isUpdating}
          >
            {isUpdating
              ? t('app_update.updating')
              : isRetry
                ? t('app_update.retry')
                : t('app_update.update_now')}
          </button>
        </div>
      </section>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
