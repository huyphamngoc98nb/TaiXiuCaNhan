import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { updateUiPersonalizationSettings } from '@/modules/settings/services/ui-personalization-settings.service';
import { nativeHapticFeedback } from '@/shared/native/haptic-feedback';
import { triggerHapticFeedback } from './haptic-feedback';

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

describe('triggerHapticFeedback', () => {
  const vibrate = vi.fn(() => true);

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android');
    vi.mocked(nativeHapticFeedback.vibrate).mockResolvedValue({ vibrated: true });
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: vibrate,
    });
  });

  it('uses native vibration on Android when haptic feedback is enabled', async () => {
    await expect(triggerHapticFeedback('success')).resolves.toBe(true);

    expect(nativeHapticFeedback.vibrate).toHaveBeenCalledWith({ duration: 24 });
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('falls back to WebView vibration when the native plugin is unavailable', async () => {
    vi.mocked(nativeHapticFeedback.vibrate).mockRejectedValue(new Error('plugin unavailable'));

    await expect(triggerHapticFeedback('warning')).resolves.toBe(true);

    expect(vibrate).toHaveBeenCalledWith([20, 40, 20]);
  });

  it('does not vibrate when haptic feedback is disabled', async () => {
    updateUiPersonalizationSettings({ hapticEnabled: false });

    await expect(triggerHapticFeedback('success')).resolves.toBe(false);

    expect(nativeHapticFeedback.vibrate).not.toHaveBeenCalled();
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('does not vibrate on web', async () => {
    vi.mocked(Capacitor.getPlatform).mockReturnValue('web');

    await expect(triggerHapticFeedback()).resolves.toBe(false);

    expect(nativeHapticFeedback.vibrate).not.toHaveBeenCalled();
    expect(vibrate).not.toHaveBeenCalled();
  });
});
