import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletList } from '@/modules/wallets/components/WalletList';
import { WalletForm } from '@/modules/wallets/components/WalletForm';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { CurrencyProvider } from '@/shared/context/CurrencyContext';
import { LanguageProvider } from '@/shared/context/LanguageContext';
import type { Wallet } from '@/modules/wallets/repositories/wallet.repository';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(async () => ({ value: 'vi' })),
    set: vi.fn(async () => undefined),
  },
}));

function wallet(overrides: Partial<Wallet>): Wallet {
  return {
    id: 'wallet-id',
    name: 'Wallet',
    currency: 'VND',
    balance: 0,
    account_type: 'cash',
    icon: null,
    color: null,
    sort_order: 0,
    is_active: 1,
    exclude_from_total: 0,
    credit_limit: null,
    statement_day: null,
    due_day: null,
    annual_fee: null,
    created_at: 0,
    updated_at: 0,
    ...overrides,
  };
}

function renderWalletList(wallets: Wallet[]) {
  return render(
    <LanguageProvider>
      <CurrencyProvider>
        <WalletList
          wallets={wallets}
          totalBalance={100000}
          loading={false}
          error={null}
        />
      </CurrencyProvider>
    </LanguageProvider>,
  );
}

describe('WalletList', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  it('shows active wallets even when their balance is zero', async () => {
    renderWalletList([
      wallet({ id: 'cash', name: 'Cash', balance: 100000 }),
      wallet({ id: 'zero', name: 'Zero balance', balance: 0 }),
      wallet({ id: 'string-zero', name: 'String zero balance', balance: '0' as unknown as number }),
      wallet({ id: 'inactive', name: 'Inactive wallet', balance: 50000, is_active: 0 }),
    ]);

    expect(await screen.findByText('Cash')).toBeTruthy();
    expect(await screen.findByText('Zero balance')).toBeTruthy();
    expect(await screen.findByText('String zero balance')).toBeTruthy();
    expect(screen.queryByText('Inactive wallet')).toBeNull();
  });

  it('uses the bottom sheet as the only scroll container for the wallet form', async () => {
    const { container } = render(
      <LanguageProvider>
        <BottomSheet isOpen onClose={vi.fn()}>
          <WalletForm onSave={vi.fn()} onClose={vi.fn()} />
        </BottomSheet>
      </LanguageProvider>,
    );

    await waitFor(() => expect(container.querySelector('form')).not.toBeNull());

    const form = container.querySelector('form') as HTMLFormElement;
    expect(form.classList.contains('form-scroll-container')).toBe(false);
    expect(form.hasAttribute('data-modal-scroll-container')).toBe(false);
    expect(container.querySelectorAll('.form-scroll-container')).toHaveLength(1);
  });
});
