import { Capacitor } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { sqlite } from '@/core/db/sqlite/pragmas';
import { getSQLiteEncryptionConfig } from '@/core/db/sqlite/encryption';

export interface AuthResult {
  authenticated: boolean;
  createdSecret: boolean;
}

export interface BiometricAuthEvent {
  result: boolean;
  message?: string | null;
}

type BiometricListenerPlugin = typeof CapacitorSQLite & {
  addListener(
    eventName: 'sqliteBiometricEvent',
    listenerFunc: (event: BiometricAuthEvent) => void,
  ): Promise<PluginListenerHandle>;
};

const BIOMETRIC_UNLOCK_KEY = 'biometric_unlock_enabled';

function isNativePlatform(): boolean {
  return Capacitor.getPlatform() !== 'web';
}

export class AuthService {
  requiresUnlock(): boolean {
    return isNativePlatform() && getSQLiteEncryptionConfig().requiresNativeSecret;
  }

  async isBiometricUnlockAvailable(): Promise<boolean> {
    if (!this.requiresUnlock()) return false;
    return (await sqlite.isInConfigBiometricAuth()).result === true;
  }

  async isBiometricUnlockEnabled(): Promise<boolean> {
    if (!this.requiresUnlock()) return false;
    const { value } = await Preferences.get({ key: BIOMETRIC_UNLOCK_KEY });
    return value === 'true';
  }

  async setBiometricUnlockEnabled(enabled: boolean): Promise<void> {
    if (enabled && !(await this.isBiometricUnlockAvailable())) {
      throw new Error('Biometric unlock is not available on this device.');
    }

    await Preferences.set({
      key: BIOMETRIC_UNLOCK_KEY,
      value: enabled ? 'true' : 'false',
    });
  }

  async hasStoredSecret(): Promise<boolean> {
    if (!this.requiresUnlock()) return true;
    return (await sqlite.isSecretStored()).result === true;
  }

  async setupPin(pin: string): Promise<AuthResult> {
    if (!this.requiresUnlock()) {
      return { authenticated: true, createdSecret: false };
    }

    const normalizedPin = pin.trim();
    if (normalizedPin.length < 6) {
      throw new Error('PIN must contain at least 6 characters.');
    }

    const secretStored = await this.hasStoredSecret();
    if (secretStored) {
      throw new Error('PIN has already been set.');
    }

    await sqlite.setEncryptionSecret(normalizedPin);
    await Preferences.set({
      key: BIOMETRIC_UNLOCK_KEY,
      value: 'false',
    });

    return { authenticated: true, createdSecret: true };
  }

  async unlockWithPin(pin: string): Promise<AuthResult> {
    if (!this.requiresUnlock()) {
      return { authenticated: true, createdSecret: false };
    }

    const normalizedPin = pin.trim();
    if (normalizedPin.length < 6) {
      throw new Error('PIN must contain at least 6 characters.');
    }

    const secretStored = await this.hasStoredSecret();
    if (!secretStored) {
      throw new Error('PIN has not been set up yet.');
    }

    const verified = (await sqlite.checkEncryptionSecret(normalizedPin)).result === true;
    if (!verified) {
      throw new Error('Invalid PIN or biometric verification failed.');
    }

    return { authenticated: true, createdSecret: false };
  }

  async unlockWithBiometrics(): Promise<AuthResult | null> {
    if (!this.requiresUnlock()) {
      return { authenticated: true, createdSecret: false };
    }

    const biometricUnlockEnabled = await this.isBiometricUnlockEnabled();
    if (!biometricUnlockEnabled) {
      return null;
    }

    const biometricEnabled = (await sqlite.isInConfigBiometricAuth()).result === true;
    if (!biometricEnabled) {
      return null;
    }

    const secretStored = (await sqlite.isSecretStored()).result === true;
    if (!secretStored) {
      return null;
    }

    return { authenticated: true, createdSecret: false };
  }

  async onBiometricResult(
    listener: (event: BiometricAuthEvent) => void,
  ): Promise<PluginListenerHandle | null> {
    if (!this.requiresUnlock()) {
      return null;
    }

    return (CapacitorSQLite as BiometricListenerPlugin).addListener(
      'sqliteBiometricEvent',
      listener,
    );
  }
}

export const authService = new AuthService();
