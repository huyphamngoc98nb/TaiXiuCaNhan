export type FontSize = 'small' | 'medium' | 'large';
export type ListDensity = 'comfortable' | 'compact';

export type StartupScreen =
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'reports'
  | 'wallets';

export interface UiPersonalizationSettings {
  fontSize: FontSize;
  listDensity: ListDensity;
  animationEnabled: boolean;
  hapticEnabled: boolean;
  startupScreen: StartupScreen;
}

export const DEFAULT_UI_PERSONALIZATION_SETTINGS: UiPersonalizationSettings = {
  fontSize: 'medium',
  listDensity: 'comfortable',
  animationEnabled: true,
  hapticEnabled: true,
  startupScreen: 'dashboard',
};

export const STORAGE_PREFIX = 'settings.ui.';
export const UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT =
  'ui-personalization-settings-change';

const FONT_SIZES: FontSize[] = ['small', 'medium', 'large'];
const LIST_DENSITIES: ListDensity[] = ['comfortable', 'compact'];
const STARTUP_SCREENS: StartupScreen[] = [
  'dashboard',
  'transactions',
  'budgets',
  'reports',
  'wallets',
];

const STORAGE_KEYS = {
  fontSize: 'font_size',
  listDensity: 'list_density',
  animationEnabled: 'animation_enabled',
  hapticEnabled: 'haptic_enabled',
  startupScreen: 'startup_screen',
} satisfies Record<keyof UiPersonalizationSettings, string>;

function isOneOf<T extends string>(value: unknown, allowedValues: readonly T[]): value is T {
  return typeof value === 'string' && allowedValues.includes(value as T);
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;

  return fallback;
}

function getStoredValue(key: keyof UiPersonalizationSettings): string | null {
  return localStorage.getItem(`${STORAGE_PREFIX}${STORAGE_KEYS[key]}`);
}

function normalizeUiPersonalizationSettings(
  value: Partial<Record<keyof UiPersonalizationSettings, unknown>>,
): UiPersonalizationSettings {
  return {
    fontSize: isOneOf(value.fontSize, FONT_SIZES)
      ? value.fontSize
      : DEFAULT_UI_PERSONALIZATION_SETTINGS.fontSize,
    listDensity: isOneOf(value.listDensity, LIST_DENSITIES)
      ? value.listDensity
      : DEFAULT_UI_PERSONALIZATION_SETTINGS.listDensity,
    animationEnabled: normalizeBoolean(
      value.animationEnabled,
      DEFAULT_UI_PERSONALIZATION_SETTINGS.animationEnabled,
    ),
    hapticEnabled: normalizeBoolean(
      value.hapticEnabled,
      DEFAULT_UI_PERSONALIZATION_SETTINGS.hapticEnabled,
    ),
    startupScreen: isOneOf(value.startupScreen, STARTUP_SCREENS)
      ? value.startupScreen
      : DEFAULT_UI_PERSONALIZATION_SETTINGS.startupScreen,
  };
}

function readStoredSettings(): UiPersonalizationSettings {
  return normalizeUiPersonalizationSettings({
    fontSize: getStoredValue('fontSize'),
    listDensity: getStoredValue('listDensity'),
    animationEnabled: getStoredValue('animationEnabled'),
    hapticEnabled: getStoredValue('hapticEnabled'),
    startupScreen: getStoredValue('startupScreen'),
  });
}

function writeStoredSettings(settings: UiPersonalizationSettings): void {
  (Object.keys(settings) as Array<keyof UiPersonalizationSettings>).forEach((key) => {
    localStorage.setItem(`${STORAGE_PREFIX}${STORAGE_KEYS[key]}`, String(settings[key]));
  });
}

function notifyUiPersonalizationSettingsChange(): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(UI_PERSONALIZATION_SETTINGS_CHANGE_EVENT));
}

export function getUiPersonalizationSettings(): UiPersonalizationSettings {
  return readStoredSettings();
}

export function saveUiPersonalizationSettings(
  settings: UiPersonalizationSettings,
): void {
  writeStoredSettings(normalizeUiPersonalizationSettings(settings));
  notifyUiPersonalizationSettingsChange();
}

export function updateUiPersonalizationSettings(
  patch: Partial<UiPersonalizationSettings>,
): UiPersonalizationSettings {
  const nextSettings = normalizeUiPersonalizationSettings({
    ...getUiPersonalizationSettings(),
    ...patch,
  });

  writeStoredSettings(nextSettings);
  notifyUiPersonalizationSettingsChange();

  return nextSettings;
}

export function resetUiPersonalizationSettings(): UiPersonalizationSettings {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  });

  notifyUiPersonalizationSettingsChange();

  return { ...DEFAULT_UI_PERSONALIZATION_SETTINGS };
}
