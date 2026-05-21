import { describe, expect, it } from 'vitest';
import { getCreditCardStatementPeriod } from '@/modules/wallets/services/credit-card.service';
import type { Wallet } from '@/modules/wallets/repositories/wallet.repository';

function timestamp(year: number, monthIndex: number, day: number, hour = 12): number {
  return new Date(year, monthIndex, day, hour, 0, 0, 0).getTime();
}

function wallet(overrides: Partial<Wallet> = {}): Wallet {
  return {
    id: 'cc-1',
    name: 'Visa',
    currency: 'VND',
    balance: -500_000,
    account_type: 'credit_card',
    icon: null,
    color: null,
    sort_order: 0,
    is_active: 1,
    exclude_from_total: 0,
    credit_limit: 5_000_000,
    statement_day: 15,
    due_day: 5,
    annual_fee: null,
    created_at: 0,
    updated_at: 0,
    ...overrides,
  };
}

describe('credit card statement cycle', () => {
  it('keeps purchases on or before closing date in the current cycle', () => {
    const period = getCreditCardStatementPeriod(wallet(), timestamp(2026, 4, 15));

    expect(new Date(period!.periodStart).toDateString()).toBe(new Date(2026, 3, 16).toDateString());
    expect(new Date(period!.periodEnd).toDateString()).toBe(new Date(2026, 4, 15).toDateString());
    expect(new Date(period!.dueAt).toDateString()).toBe(new Date(2026, 5, 5).toDateString());
  });

  it('moves purchases after closing date into the next billing cycle', () => {
    const period = getCreditCardStatementPeriod(wallet(), timestamp(2026, 4, 16));

    expect(new Date(period!.periodStart).toDateString()).toBe(new Date(2026, 4, 16).toDateString());
    expect(new Date(period!.periodEnd).toDateString()).toBe(new Date(2026, 5, 15).toDateString());
    expect(new Date(period!.dueAt).toDateString()).toBe(new Date(2026, 6, 5).toDateString());
  });
});
