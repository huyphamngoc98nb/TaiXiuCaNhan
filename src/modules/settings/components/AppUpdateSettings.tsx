import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  getAppUpdateAutoCheckEnabled,
  setAppUpdateAutoCheckEnabled,
} from '@/modules/app-update';
import { useLanguage } from '@/shared/context/LanguageContext';

export function AppUpdateSettings() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    void getAppUpdateAutoCheckEnabled()
      .then((value) => {
        if (active) setEnabled(value);
      })
      .catch(() => {
        // Keep the enabled default when local preferences cannot be read.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function toggleAutoCheck() {
    if (loading || saving) return;

    const nextEnabled = !enabled;
    setSaving(true);
    try {
      await setAppUpdateAutoCheckEnabled(nextEnabled);
      setEnabled(nextEnabled);
    } catch {
      // Keep the last persisted value when saving fails.
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={t('app_update.auto_check')}
      onClick={() => void toggleAutoCheck()}
      disabled={loading || saving}
      className="flex w-full items-center gap-3 text-left disabled:opacity-60"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: 'rgba(20,184,166,0.12)', color: '#0f766e' }}
      >
        <RefreshCw size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-text">
          {t('app_update.auto_check')}
        </p>
        <p className="text-[11px] leading-4 text-muted">
          {t('app_update.auto_check_description')}
        </p>
      </div>

      <span
        className={`flex h-6 w-12 shrink-0 items-center rounded-full px-1 transition-colors ${
          enabled ? 'bg-primary' : 'bg-surface-muted'
        }`}
        aria-hidden="true"
      >
        <span
          className={`h-4 w-4 rounded-full shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
          style={{ background: '#ffffff' }}
        />
      </span>
    </button>
  );
}
