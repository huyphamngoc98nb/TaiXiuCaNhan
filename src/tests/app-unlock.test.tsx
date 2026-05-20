import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppUnlock } from '@/app/providers/AppUnlock';

const authServiceMock = vi.hoisted(() => ({
  hasStoredSecret: vi.fn(),
  isBiometricUnlockEnabled: vi.fn(),
  onBiometricResult: vi.fn(),
  setupPin: vi.fn(),
  unlockWithBiometrics: vi.fn(),
  unlockWithPin: vi.fn(),
}));

vi.mock('@/core/auth/auth.service', () => ({
  authService: authServiceMock,
}));

function enterPin(pin: string) {
  for (const digit of pin) {
    fireEvent.click(screen.getByRole('button', { name: `Enter ${digit}` }));
  }
}

describe('AppUnlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authServiceMock.hasStoredSecret.mockResolvedValue(false);
    authServiceMock.isBiometricUnlockEnabled.mockResolvedValue(false);
    authServiceMock.onBiometricResult.mockResolvedValue(null);
    authServiceMock.setupPin.mockResolvedValue({ authenticated: true, createdSecret: true });
    authServiceMock.unlockWithBiometrics.mockResolvedValue(null);
    authServiceMock.unlockWithPin.mockResolvedValue({ authenticated: true, createdSecret: false });
  });

  it('starts with PIN setup when no native secret exists and does not trigger biometrics', async () => {
    render(<AppUnlock onUnlocked={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Create PIN' })).toBeTruthy();
    expect(authServiceMock.isBiometricUnlockEnabled).not.toHaveBeenCalled();
    expect(authServiceMock.onBiometricResult).not.toHaveBeenCalled();
    expect(authServiceMock.unlockWithBiometrics).not.toHaveBeenCalled();
  });

  it('requires create and confirm PIN before unlocking first launch', async () => {
    const onUnlocked = vi.fn();
    render(<AppUnlock onUnlocked={onUnlocked} />);

    expect(await screen.findByRole('heading', { name: 'Create PIN' })).toBeTruthy();

    enterPin('123456');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Confirm PIN' })).toBeTruthy();

    enterPin('123456');
    fireEvent.click(screen.getByRole('button', { name: 'Create PIN' }));

    await waitFor(() => {
      expect(authServiceMock.setupPin).toHaveBeenCalledWith('123456');
      expect(onUnlocked).toHaveBeenCalledTimes(1);
    });
  });
});
