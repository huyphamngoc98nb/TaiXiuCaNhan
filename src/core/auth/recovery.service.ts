import {
  completeResetNavigationState,
  resetLocalDataStorage,
} from '@/core/db/reset-local-data';

export const BIOMETRIC_UNLOCK_KEY = 'biometric_unlock_enabled';

export class RecoveryService {
  async resetLocalData(): Promise<void> {
    await resetLocalDataStorage();
  }

  completeResetNavigationState(): void {
    completeResetNavigationState();
  }
}

export const recoveryService = new RecoveryService();
