export type DefaultTransactionType = 'expense' | 'income' | 'transfer';
export type DefaultTransactionDateMode = 'today' | 'last_used';

export interface TransactionInputSettings {
  defaultWalletId: string | null;
  defaultTransactionType: DefaultTransactionType;
  defaultDateMode: DefaultTransactionDateMode;
  enableMoneyKeyboard: boolean;
  autoFocusAmount: boolean;
  duplicateWarningEnabled: boolean;
  lastUsedTransactionDate: number | null;
}

export type UpdateTransactionInputSettingsInput = Partial<TransactionInputSettings>;

export const TRANSACTION_INPUT_SETTINGS_STORAGE_KEY = 'transaction_input_settings';

export const DEFAULT_TRANSACTION_INPUT_SETTINGS: TransactionInputSettings = {
  defaultWalletId: null,
  defaultTransactionType: 'expense',
  defaultDateMode: 'today',
  enableMoneyKeyboard: true,
  autoFocusAmount: false,
  duplicateWarningEnabled: true,
  lastUsedTransactionDate: null,
};

const DEFAULT_TRANSACTION_TYPES: DefaultTransactionType[] = ['expense', 'income', 'transfer'];
const DEFAULT_DATE_MODES: DefaultTransactionDateMode[] = ['today', 'last_used'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDefaultTransactionType(value: unknown): value is DefaultTransactionType {
  return (
    typeof value === 'string' &&
    DEFAULT_TRANSACTION_TYPES.includes(value as DefaultTransactionType)
  );
}

function isDefaultDateMode(value: unknown): value is DefaultTransactionDateMode {
  return (
    typeof value === 'string' &&
    DEFAULT_DATE_MODES.includes(value as DefaultTransactionDateMode)
  );
}

function normalizeWalletId(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeTimestamp(value: unknown): number | null {
  if (typeof value !== 'number') return null;

  return Number.isFinite(value) && value > 0 ? value : null;
}

function normalizeTransactionInputSettings(value: unknown): TransactionInputSettings {
  if (!isRecord(value)) {
    return { ...DEFAULT_TRANSACTION_INPUT_SETTINGS };
  }

  return {
    defaultWalletId: normalizeWalletId(value.defaultWalletId),
    defaultTransactionType: isDefaultTransactionType(value.defaultTransactionType)
      ? value.defaultTransactionType
      : DEFAULT_TRANSACTION_INPUT_SETTINGS.defaultTransactionType,
    defaultDateMode: isDefaultDateMode(value.defaultDateMode)
      ? value.defaultDateMode
      : DEFAULT_TRANSACTION_INPUT_SETTINGS.defaultDateMode,
    enableMoneyKeyboard: normalizeBoolean(
      value.enableMoneyKeyboard,
      DEFAULT_TRANSACTION_INPUT_SETTINGS.enableMoneyKeyboard
    ),
    autoFocusAmount: normalizeBoolean(
      value.autoFocusAmount,
      DEFAULT_TRANSACTION_INPUT_SETTINGS.autoFocusAmount
    ),
    duplicateWarningEnabled: normalizeBoolean(
      value.duplicateWarningEnabled,
      DEFAULT_TRANSACTION_INPUT_SETTINGS.duplicateWarningEnabled
    ),
    lastUsedTransactionDate: normalizeTimestamp(value.lastUsedTransactionDate),
  };
}

function readStoredSettings(): unknown {
  try {
    const rawValue = localStorage.getItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function writeStoredSettings(settings: TransactionInputSettings): void {
  localStorage.setItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function getTransactionInputSettings(): TransactionInputSettings {
  return normalizeTransactionInputSettings(readStoredSettings());
}

export function saveTransactionInputSettings(
  settings: TransactionInputSettings
): TransactionInputSettings {
  const normalizedSettings = normalizeTransactionInputSettings(settings);
  writeStoredSettings(normalizedSettings);

  return normalizedSettings;
}

export function updateTransactionInputSettings(
  input: UpdateTransactionInputSettingsInput
): TransactionInputSettings {
  const nextSettings = normalizeTransactionInputSettings({
    ...getTransactionInputSettings(),
    ...input,
  });

  writeStoredSettings(nextSettings);

  return nextSettings;
}

export function getLastUsedTransactionDate(): number | null {
  return getTransactionInputSettings().lastUsedTransactionDate;
}

export function saveLastUsedTransactionDate(timestamp: unknown): TransactionInputSettings {
  const lastUsedTransactionDate = normalizeTimestamp(timestamp);

  if (lastUsedTransactionDate === null) {
    return getTransactionInputSettings();
  }

  return updateTransactionInputSettings({ lastUsedTransactionDate });
}

export function resetTransactionInputSettings(): TransactionInputSettings {
  localStorage.removeItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY);

  return { ...DEFAULT_TRANSACTION_INPUT_SETTINGS };
}
