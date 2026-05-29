export const APP_LOCK_SUSPEND_EVENT = 'app-lock:suspend';
export const APP_LOCK_RESUME_EVENT = 'app-lock:resume';
export const APP_LOCK_FORCE_UNLOCK_EVENT = 'app:lock:force-unlock';

export function suspendAppLock() {
  window.dispatchEvent(new Event(APP_LOCK_SUSPEND_EVENT));
}

export function resumeAppLock() {
  window.dispatchEvent(new Event(APP_LOCK_RESUME_EVENT));
}

export function forceAppUnlock() {
  window.dispatchEvent(new Event(APP_LOCK_FORCE_UNLOCK_EVENT));
}
