import { useEffect } from 'react';
import { useUiPersonalizationSettings } from '@/shared/hooks/useUiPersonalizationSettings';

export function AppUiPreferencesApplier() {
  const settings = useUiPersonalizationSettings();

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.fontSize = settings.fontSize;
    root.dataset.reduceMotion = settings.animationEnabled ? 'false' : 'true';

    return () => {
      root.dataset.fontSize = 'medium';
      root.dataset.reduceMotion = 'false';
    };
  }, [settings.animationEnabled, settings.fontSize]);

  return null;
}
