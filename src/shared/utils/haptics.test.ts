import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { updateUiPersonalizationSettings } from '@/modules/settings/services/ui-personalization-settings.service';
import { nativeHapticFeedback } from '@/shared/native/haptic-feedback';
import {
  triggerLightHaptic,
  triggerSuccessHaptic,
  triggerWarningHaptic,
} from './haptics';

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(),
  },
  registerPlugin: vi.fn(() => ({
    vibrate: vi.fn(),
  })),
}));

vi.mock('@/shared/native/haptic-feedback', () => ({
  nativeHapticFeedback: {
    vibrate: vi.fn(),
  },
}));

describe('haptics', () => {
  const vibrate = vi.fn(() => true);

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');
    vi.mocked(nativeHapticFeedback.vibrate).mockResolvedValue({ vibrated: true });
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: vibrate,
    });
  });

  it('does not call vibration APIs when haptics are disabled', async () => {
    updateUiPersonalizationSettings({ hapticEnabled: false });

    await triggerLightHaptic();

    expect(nativeHapticFeedback.vibrate).not.toHaveBeenCalled();
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('uses Web Vibration when haptics are enabled on web', async () => {
    await triggerLightHaptic();

    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it('uses native vibration first on Android', async () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');

    await triggerSuccessHaptic();

    expect(nativeHapticFeedback.vibrate).toHaveBeenCalledWith({ duration: 24 });
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('does not throw when native and web vibration fail', async () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    vi.mocked(nativeHapticFeedback.vibrate).mockRejectedValue(new Error('native unavailable'));
    vibrate.mockImplementationOnce(() => {
      throw new Error('web unavailable');
    });

    await expect(triggerWarningHaptic()).resolves.toBeUndefined();
  });
});
