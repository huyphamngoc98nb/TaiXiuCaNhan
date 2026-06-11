import { useEffect } from 'react';
import { WEB_PERSIST_FAIL_EVENT } from './transaction';

/**
 * Hook: listens for Web SQLite persistence failures.
 * Call this once near the app root (e.g. in App.tsx) on Web platform.
 * onFail receives the underlying error for display/logging.
 */
export function useWebPersistWarning(onFail: (err: unknown) => void) {
  useEffect(() => {
    const handler = (e: Event) => {
      onFail((e as CustomEvent).detail?.error);
    };
    window.addEventListener(WEB_PERSIST_FAIL_EVENT, handler);
    return () => window.removeEventListener(WEB_PERSIST_FAIL_EVENT, handler);
  }, [onFail]);
}
