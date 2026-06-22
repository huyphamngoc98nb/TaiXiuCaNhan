import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_TRANSACTION_INPUT_SETTINGS,
  TRANSACTION_INPUT_SETTINGS_STORAGE_KEY,
  getLastUsedTransactionDate,
  getTransactionInputSettings,
  resetTransactionInputSettings,
  saveLastUsedTransactionDate,
  saveTransactionInputSettings,
  updateTransactionInputSettings,
} from './transaction-input-settings.service';

describe('transaction input settings service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns defaults when no settings have been saved', () => {
    expect(getTransactionInputSettings()).toEqual(DEFAULT_TRANSACTION_INPUT_SETTINGS);
  });

  it('persists transaction input settings through the service wrapper', () => {
    const saved = saveTransactionInputSettings({
      defaultWalletId: 'wallet-cash',
      defaultTransactionType: 'income',
      defaultDateMode: 'last_used',
      enableMoneyKeyboard: false,
      autoFocusAmount: true,
      duplicateWarningEnabled: false,
      lastUsedTransactionDate: 1_717_200_000_000,
    });

    expect(saved).toEqual({
      defaultWalletId: 'wallet-cash',
      defaultTransactionType: 'income',
      defaultDateMode: 'last_used',
      enableMoneyKeyboard: false,
      autoFocusAmount: true,
      duplicateWarningEnabled: false,
      lastUsedTransactionDate: 1_717_200_000_000,
    });
    expect(getTransactionInputSettings()).toEqual(saved);
  });

  it('updates only the provided fields', () => {
    saveTransactionInputSettings({
      defaultWalletId: 'wallet-cash',
      defaultTransactionType: 'expense',
      defaultDateMode: 'today',
      enableMoneyKeyboard: true,
      autoFocusAmount: false,
      duplicateWarningEnabled: true,
      lastUsedTransactionDate: null,
    });

    const updated = updateTransactionInputSettings({
      defaultTransactionType: 'transfer',
      autoFocusAmount: true,
    });

    expect(updated).toEqual({
      defaultWalletId: 'wallet-cash',
      defaultTransactionType: 'transfer',
      defaultDateMode: 'today',
      enableMoneyKeyboard: true,
      autoFocusAmount: true,
      duplicateWarningEnabled: true,
      lastUsedTransactionDate: null,
    });
  });

  it('normalizes invalid or malformed stored values to defaults', () => {
    localStorage.setItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY, JSON.stringify({
      defaultWalletId: '  ',
      defaultTransactionType: 'refund',
      defaultDateMode: 'yesterday',
      enableMoneyKeyboard: 'yes',
      autoFocusAmount: 1,
      duplicateWarningEnabled: null,
      lastUsedTransactionDate: -1,
    }));

    expect(getTransactionInputSettings()).toEqual(DEFAULT_TRANSACTION_INPUT_SETTINGS);
  });

  it('falls back to defaults when stored JSON is corrupted', () => {
    localStorage.setItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY, '{bad-json');

    expect(getTransactionInputSettings()).toEqual(DEFAULT_TRANSACTION_INPUT_SETTINGS);
  });

  it('saves and reads the last used transaction date', () => {
    saveLastUsedTransactionDate(1_717_200_000_000);

    expect(getLastUsedTransactionDate()).toBe(1_717_200_000_000);
  });

  it('does not overwrite last used transaction date with an invalid timestamp', () => {
    saveLastUsedTransactionDate(1_717_200_000_000);
    saveLastUsedTransactionDate(Number.NaN);

    expect(getLastUsedTransactionDate()).toBe(1_717_200_000_000);
  });

  it('clears saved settings on reset', () => {
    updateTransactionInputSettings({ defaultWalletId: 'wallet-bank' });

    expect(resetTransactionInputSettings()).toEqual(DEFAULT_TRANSACTION_INPUT_SETTINGS);
    expect(localStorage.getItem(TRANSACTION_INPUT_SETTINGS_STORAGE_KEY)).toBeNull();
  });
});
