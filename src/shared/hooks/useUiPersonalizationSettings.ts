import { useEffect, useState } from 'react';
import {
  STORAGE_PREFIX,
  UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT,
  type UiPersonalizationSettings,
  getUiPersonalizationSettings,
} from '@/modules/settings/services/ui-personalization-settings.service';

function isUiPersonalizationStorageKey(key: string | null): boolean {
  return key === null || key.startsWith(STORAGE_PREFIX);
}

export function useUiPersonalizationSettings(): UiPersonalizationSettings {
  const [settings, setSettings] = useState<UiPersonalizationSettings>(() => (
    getUiPersonalizationSettings()
  ));

  useEffect(() => {
    const reloadSettings = () => {
      setSettings(getUiPersonalizationSettings());
    };

    const handleStorage = (event: StorageEvent) => {
      if (isUiPersonalizationStorageKey(event.key)) {
        reloadSettings();
      }
    };

    window.addEventListener(UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT, reloadSettings);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT, reloadSettings);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return settings;
}
