import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_UI_PERSONALIZATION_SETTINGS,
  STORAGE_PREFIX,
  UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT,
  getUiPersonalizationSettings,
  resetUiPersonalizationSettings,
  saveUiPersonalizationSettings,
  updateUiPersonalizationSettings,
} from './ui-personalization-settings.service';

describe('ui personalization settings service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns defaults when no settings have been saved', () => {
    expect(getUiPersonalizationSettings()).toEqual(DEFAULT_UI_PERSONALIZATION_SETTINGS);
  });

  it('persists ui personalization settings through the service wrapper', () => {
    const settings = {
      fontSize: 'large' as const,
      listDensity: 'compact' as const,
      animationEnabled: false,
      hapticEnabled: false,
      startupScreen: 'reports' as const,
    };

    saveUiPersonalizationSettings(settings);

    expect(getUiPersonalizationSettings()).toEqual(settings);
  });

  it('updates only the provided fields', () => {
    saveUiPersonalizationSettings({
      ...DEFAULT_UI_PERSONALIZATION_SETTINGS,
      fontSize: 'small',
      listDensity: 'comfortable',
    });

    const updated = updateUiPersonalizationSettings({
      listDensity: 'compact',
      hapticEnabled: false,
    });

    expect(updated).toEqual({
      ...DEFAULT_UI_PERSONALIZATION_SETTINGS,
      fontSize: 'small',
      listDensity: 'compact',
      hapticEnabled: false,
    });
  });

  it('clears saved settings on reset', () => {
    updateUiPersonalizationSettings({ fontSize: 'large' });

    expect(resetUiPersonalizationSettings()).toEqual(DEFAULT_UI_PERSONALIZATION_SETTINGS);
    expect(localStorage.getItem(`${STORAGE_PREFIX}font_size`)).toBeNull();
  });

  it('falls back to the default font size when storage is invalid', () => {
    localStorage.setItem(`${STORAGE_PREFIX}font_size`, 'extra-large');

    expect(getUiPersonalizationSettings().fontSize).toBe(
      DEFAULT_UI_PERSONALIZATION_SETTINGS.fontSize,
    );
  });

  it('falls back to the default list density when storage is invalid', () => {
    localStorage.setItem(`${STORAGE_PREFIX}list_density`, 'dense');

    expect(getUiPersonalizationSettings().listDensity).toBe(
      DEFAULT_UI_PERSONALIZATION_SETTINGS.listDensity,
    );
  });

  it('falls back to the default startup screen when storage is invalid', () => {
    localStorage.setItem(`${STORAGE_PREFIX}startup_screen`, 'settings');

    expect(getUiPersonalizationSettings().startupScreen).toBe(
      DEFAULT_UI_PERSONALIZATION_SETTINGS.startupScreen,
    );
  });

  it('parses boolean storage safely', () => {
    localStorage.setItem(`${STORAGE_PREFIX}animation_enabled`, 'false');
    localStorage.setItem(`${STORAGE_PREFIX}haptic_enabled`, 'true');

    expect(getUiPersonalizationSettings().animationEnabled).toBe(false);
    expect(getUiPersonalizationSettings().hapticEnabled).toBe(true);

    localStorage.setItem(`${STORAGE_PREFIX}animation_enabled`, 'yes');
    localStorage.setItem(`${STORAGE_PREFIX}haptic_enabled`, 'no');

    expect(getUiPersonalizationSettings().animationEnabled).toBe(
      DEFAULT_UI_PERSONALIZATION_SETTINGS.animationEnabled,
    );
    expect(getUiPersonalizationSettings().hapticEnabled).toBe(
      DEFAULT_UI_PERSONALIZATION_SETTINGS.hapticEnabled,
    );
  });

  it('notifies listeners when settings update or reset', () => {
    const listener = vi.fn();
    window.addEventListener(UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT, listener);

    updateUiPersonalizationSettings({ fontSize: 'small' });
    resetUiPersonalizationSettings();

    window.removeEventListener(UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT, listener);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
