import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { ErrorScreen } from '@/shared/components/ErrorScreen';
import { logger } from '@/core/telemetry/logger';
import { initDatabaseConnection } from '@/core/db/sqlite/connection';
import { runMigrations } from '@/core/db/migrations/migration-runner';
import { seedDefaultData } from '@/core/db/seed/default-categories';
import { authService } from '@/core/auth/auth.service';
import { AppUnlock } from './AppUnlock';

interface AppBootstrapProps {
  children: ReactNode;
}

const MOBILE_IDLE_LOCK_TIMEOUT_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'input', 'scroll'] as const;

let globalInitPromise: Promise<void> | null = null;

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [isUnlocked, setIsUnlocked] = useState(() => !authService.requiresUnlock());
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const isUnlockedRef = useRef(isUnlocked);

  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
  }, [isUnlocked]);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const lockApp = useCallback(() => {
    if (!authService.requiresUnlock() || !isUnlockedRef.current) return;
    clearIdleTimer();
    setIsUnlocked(false);
  }, [clearIdleTimer]);

  const resetIdleTimer = useCallback(() => {
    if (!authService.requiresUnlock() || Capacitor.getPlatform() === 'web' || !isUnlockedRef.current) {
      clearIdleTimer();
      return;
    }

    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(lockApp, MOBILE_IDLE_LOCK_TIMEOUT_MS);
  }, [clearIdleTimer, lockApp]);

  useEffect(() => {
    if (!isUnlocked) return;

    let isMounted = true;

    async function initializeApp() {
      if (globalInitPromise) {
        await globalInitPromise;
        if (isMounted) setIsReady(true);
        return;
      }

      globalInitPromise = (async () => {
        logger.info('AppBootstrap: Starting database initialization...');
        await initDatabaseConnection();
        await runMigrations();
        await seedDefaultData();
        logger.info('AppBootstrap: Initialization complete.');
      })();

      try {
        await globalInitPromise;
        if (isMounted) setIsReady(true);
      } catch (err) {
        logger.error('AppBootstrap: Initialization failed', err);
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
        globalInitPromise = null; // Allow retry
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (!authService.requiresUnlock() || Capacitor.getPlatform() === 'web') return;

    let removeAppStateListener: (() => Promise<void>) | undefined;
    const activityListenerOptions: AddEventListenerOptions = { capture: true, passive: true };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lockApp();
        return;
      }

      resetIdleTimer();
    };

    async function registerAppStateListener() {
      const listener = await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          lockApp();
          return;
        }

        resetIdleTimer();
      });

      removeAppStateListener = () => listener.remove();
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, activityListenerOptions);
    });
    document.addEventListener('visibilitychange', handleVisibilityChange, activityListenerOptions);
    resetIdleTimer();
    void registerAppStateListener();

    return () => {
      clearIdleTimer();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer, activityListenerOptions);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange, activityListenerOptions);
      if (removeAppStateListener) {
        void removeAppStateListener();
      }
    };
  }, [clearIdleTimer, lockApp, resetIdleTimer]);

  if (error) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  if (!isUnlocked) {
    return <AppUnlock onUnlocked={() => setIsUnlocked(true)} />;
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
