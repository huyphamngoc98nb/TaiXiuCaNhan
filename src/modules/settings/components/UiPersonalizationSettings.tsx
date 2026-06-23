import { useMemo, useState } from 'react';
import {
  Activity,
  RotateCcw,
  Rows3,
  Settings2,
  Smartphone,
  Type,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { DropdownList } from '@/shared/components/DropdownList';
import { useLanguage } from '@/shared/context/LanguageContext';
import {
  FontSize,
  ListDensity,
  StartupScreen,
  UiPersonalizationSettings as UiPersonalizationSettingsValue,
  getUiPersonalizationSettings,
  resetUiPersonalizationSettings,
  updateUiPersonalizationSettings,
} from '../services/ui-personalization-settings.service';

interface SettingLabelProps {
  icon: LucideIcon;
  label: string;
}

interface ToggleSettingProps {
  checked: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onChange: (checked: boolean) => void;
}

function SettingLabel({ icon: Icon, label }: SettingLabelProps) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-semibold text-text">
      <Icon size={16} className="text-indigo-500" />
      <span>{label}</span>
    </div>
  );
}

function ToggleSetting({
  checked,
  icon: Icon,
  title,
  description,
  onChange,
}: ToggleSettingProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-[12px] bg-bg px-3 py-3 text-left transition-colors active:bg-bg-subtle"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text">{title}</p>
        <p className="text-[11px] leading-4 text-muted">{description}</p>
      </div>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

export function UiPersonalizationSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<UiPersonalizationSettingsValue>(() => (
    getUiPersonalizationSettings()
  ));

  const fontSizeOptions = useMemo(() => [
    { value: 'small' as const, label: t('settings.ui_font_size_small') },
    { value: 'medium' as const, label: t('settings.ui_font_size_medium') },
    { value: 'large' as const, label: t('settings.ui_font_size_large') },
  ], [t]);

  const listDensityOptions = useMemo(() => [
    { value: 'comfortable' as const, label: t('settings.ui_list_density_comfortable') },
    { value: 'compact' as const, label: t('settings.ui_list_density_compact') },
  ], [t]);

  const startupScreenOptions = useMemo(() => [
    { value: 'dashboard' as const, label: t('settings.ui_startup_dashboard') },
    { value: 'transactions' as const, label: t('settings.ui_startup_transactions') },
    { value: 'budgets' as const, label: t('settings.ui_startup_budgets') },
    { value: 'reports' as const, label: t('settings.ui_startup_reports') },
    { value: 'wallets' as const, label: t('settings.ui_startup_wallets') },
  ], [t]);

  const updateSettings = (patch: Partial<UiPersonalizationSettingsValue>) => {
    setSettings(updateUiPersonalizationSettings(patch));
  };

  const resetSettings = () => {
    setSettings(resetUiPersonalizationSettings());
  };

  const previewScale = settings.fontSize === 'small'
    ? 0.92
    : settings.fontSize === 'large'
      ? 1.08
      : 1;
  const isCompact = settings.listDensity === 'compact';

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2.5">
        <Settings2 size={20} className="text-primary" />
        <h3 className="m-0 text-[1.1rem] font-semibold">
          {t('settings.ui_personalization_title')}
        </h3>
      </div>

      <p className="mb-4 text-[0.9rem] text-muted">
        {t('settings.ui_personalization_desc')}
      </p>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <SettingLabel icon={Type} label={t('settings.ui_font_size')} />
            <DropdownList<FontSize>
              value={settings.fontSize}
              onChange={(value) => updateSettings({ fontSize: value })}
              ariaLabel={t('settings.ui_font_size')}
              options={fontSizeOptions}
            />
          </div>

          <div className="space-y-1.5">
            <SettingLabel icon={Rows3} label={t('settings.ui_list_density')} />
            <DropdownList<ListDensity>
              value={settings.listDensity}
              onChange={(value) => updateSettings({ listDensity: value })}
              ariaLabel={t('settings.ui_list_density')}
              options={listDensityOptions}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <SettingLabel icon={Smartphone} label={t('settings.ui_startup_screen')} />
            <DropdownList<StartupScreen>
              value={settings.startupScreen}
              onChange={(value) => updateSettings({ startupScreen: value })}
              ariaLabel={t('settings.ui_startup_screen')}
              options={startupScreenOptions}
            />
          </div>
        </div>

        <div className="space-y-2">
          <ToggleSetting
            checked={settings.animationEnabled}
            icon={Zap}
            title={t('settings.ui_animation')}
            description={t('settings.ui_animation_desc')}
            onChange={(checked) => updateSettings({ animationEnabled: checked })}
          />
          <ToggleSetting
            checked={settings.hapticEnabled}
            icon={Activity}
            title={t('settings.ui_haptic')}
            description={t('settings.ui_haptic_desc')}
            onChange={(checked) => updateSettings({ hapticEnabled: checked })}
          />
        </div>

        <div className="rounded-[12px] bg-bg px-3 py-3">
          <p className="mb-2 text-[13px] font-semibold text-text">
            {t('settings.ui_preview')}
          </p>
          <div
            className={`${isCompact ? 'space-y-2' : 'space-y-3'} rounded-[10px] border border-border bg-surface p-3`}
            style={{
              fontSize: `${previewScale}rem`,
              transition: settings.animationEnabled ? 'all 160ms ease' : 'none',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold leading-tight text-text">
                  {t('settings.ui_preview_title')}
                </p>
                <p className="truncate text-[0.78em] leading-4 text-muted">
                  {t('settings.ui_preview_subtitle')}
                </p>
              </div>
              <span className="h-8 w-8 shrink-0 rounded-[9px] bg-indigo-50 text-center leading-8 text-indigo-600">
                <Zap size={14} className="inline-block" />
              </span>
            </div>
            <button
              type="button"
              className={`w-full rounded-[10px] bg-primary px-3 text-[0.82em] font-semibold text-white ${
                isCompact ? 'min-h-[34px]' : 'min-h-[40px]'
              }`}
            >
              {t('settings.ui_preview_button')}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={resetSettings}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-bg-subtle px-4 text-[13px] font-semibold text-text transition-colors active:bg-surface-muted"
        >
          <RotateCcw size={16} />
          <span>{t('settings.ui_reset')}</span>
        </button>
      </div>
    </div>
  );
}
