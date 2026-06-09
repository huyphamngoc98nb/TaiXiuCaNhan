import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { WalletsPage } from '@/modules/wallets/pages/WalletsPage';

vi.mock('@/modules/wallets/hooks/useWallets', () => ({
  useWallets: () => ({
    wallets: [],
    totalBalance: 0,
    loading: false,
    error: null,
    createWallet: vi.fn(),
    updateWallet: vi.fn(),
    deleteWallet: vi.fn(),
  }),
}));

vi.mock('@/modules/wallets/components/WalletList', () => ({
  WalletList: () => null,
}));

vi.mock('@/modules/wallets/components/WalletForm', () => ({
  WalletForm: () => <div>Wallet form</div>,
}));

vi.mock('@/shared/components/BottomSheet', () => ({
  BottomSheet: ({
    children,
    isOpen,
    fullScreenOnAndroid,
  }: {
    children: ReactNode;
    isOpen: boolean;
    fullScreenOnAndroid?: boolean;
  }) => (
    <div
      data-testid="wallet-sheet"
      data-open={String(isOpen)}
      data-fullscreen-android={String(fullScreenOnAndroid)}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/shared/components/ConfirmDialog/ConfirmContext', () => ({
  useConfirm: () => ({ confirm: vi.fn() }),
}));

vi.mock('@/shared/components/Toast/ToastContext', () => ({
  useToast: () => ({ success: vi.fn() }),
}));

vi.mock('@/shared/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

describe('WalletsPage', () => {
  it('opens the wallet form as a full-screen sheet on Android', async () => {
    render(
      <MemoryRouter initialEntries={['/wallets/new']}>
        <WalletsPage />
      </MemoryRouter>,
    );

    const sheet = screen.getByTestId('wallet-sheet');
    await waitFor(() => expect(sheet.dataset.open).toBe('true'));
    expect(sheet.dataset.fullscreenAndroid).toBe('true');
  });
});
