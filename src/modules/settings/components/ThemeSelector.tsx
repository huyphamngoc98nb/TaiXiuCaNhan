import { Monitor, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { ThemePreference, useTheme } from '@/shared/context/ThemeContext';

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  icon: typeof Sun;
  labelKey: 'settings.theme_light' | 'settings.theme_dark' | 'settings.theme_system';
}> = [
  { value: 'light', icon: Sun, labelKey: 'settings.theme_light' },
  { value: 'dark', icon: Moon, labelKey: 'settings.theme_dark' },
  { value: 'system', icon: Monitor, labelKey: 'settings.theme_system' },
];

export function ThemeSelector() {
  const { themePreference, resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2.5">
        <Monitor size={20} className="text-primary" />
        <h3 className="m-0 text-[1.1rem] font-semibold">{t('settings.theme')}</h3>
      </div>

      <p className="mb-3 text-[0.9rem] text-muted">{t('settings.select_theme')}</p>

      <div className="grid grid-cols-3 gap-2">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = themePreference === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(option.value)}
              className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-[12px] border px-2 text-[12px] font-bold transition-colors active:scale-[0.98]"
              style={{
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                background: isActive ? 'var(--primary-soft)' : 'var(--bg)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              <Icon size={18} />
              <span>{t(option.labelKey)}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] font-medium text-subtle">
        {themePreference === 'system'
          ? `${t('settings.theme_system')} -> ${
              resolvedTheme === 'dark' ? t('settings.theme_dark') : t('settings.theme_light')
            }`
          : t('settings.theme_saved')}
      </p>
    </div>
  );
}
