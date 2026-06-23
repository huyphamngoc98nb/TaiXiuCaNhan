import { Capacitor } from '@capacitor/core';
import { getUiPersonalizationSettings } from '@/modules/settings/services/ui-personalization-settings.service';
import { nativeHapticFeedback } from '@/shared/native/haptic-feedback';

export type HapticFeedbackPattern = 'selection' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticFeedbackPattern, number | number[]> = {
  selection: 15,
  success: 24,
  warning: [20, 40, 20],
};

function getPrimaryDuration(pattern: HapticFeedbackPattern): number {
  const value = HAPTIC_PATTERNS[pattern];

  return Array.isArray(value) ? value[0] : value;
}

export async function triggerHapticFeedback(
  pattern: HapticFeedbackPattern = 'selection',
): Promise<boolean> {
  if (Capacitor.getPlatform() !== 'android') return false;
  if (!getUiPersonalizationSettings().hapticEnabled) return false;

  try {
    const result = await nativeHapticFeedback.vibrate({
      duration: getPrimaryDuration(pattern),
    });

    if (result.vibrated) return true;
  } catch {
    // Older web builds or unsupported native plugins can still use WebView vibration.
  }

  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return false;
  }

  return navigator.vibrate(HAPTIC_PATTERNS[pattern]);
}
