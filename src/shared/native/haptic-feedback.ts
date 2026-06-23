import { registerPlugin } from '@capacitor/core';

export interface HapticFeedbackResult {
  vibrated: boolean;
}

export interface HapticFeedbackPlugin {
  vibrate(options: { duration: number }): Promise<HapticFeedbackResult>;
}

export const nativeHapticFeedback =
  registerPlugin<HapticFeedbackPlugin>('HapticFeedback');
