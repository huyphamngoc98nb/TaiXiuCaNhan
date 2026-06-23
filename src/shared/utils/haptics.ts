import { Capacitor } from '@capacitor/core';
import { getUiPersonalizationSettings } from '@/modules/settings/services/ui-personalization-settings.service';
import { nativeHapticFeedback } from '@/shared/native/haptic-feedback';

type HapticPattern = 'light' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  success: 24,
  warning: [20, 40, 20],
};

function getPrimaryDuration(pattern: HapticPattern): number {
  const value = HAPTIC_PATTERNS[pattern];

  return Array.isArray(value) ? value[0] : value;
}

async function triggerHaptic(pattern: HapticPattern): Promise<void> {
  if (!getUiPersonalizationSettings().hapticEnabled) return;

  try {
    if (Capacitor.getPlatform() === 'android') {
      const result = await nativeHapticFeedback.vibrate({
        duration: getPrimaryDuration(pattern),
      });

      if (result.vibrated) return;
    }
  } catch {
    // Unsupported native bridges fall through to Web Vibration when available.
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(HAPTIC_PATTERNS[pattern]);
    }
  } catch {
    // Haptics are best effort and must never break the user action.
  }
}

export async function triggerLightHaptic(): Promise<void> {
  await triggerHaptic('light');
}

export async function triggerSuccessHaptic(): Promise<void> {
  await triggerHaptic('success');
}

export async function triggerWarningHaptic(): Promise<void> {
  await triggerHaptic('warning');
}
