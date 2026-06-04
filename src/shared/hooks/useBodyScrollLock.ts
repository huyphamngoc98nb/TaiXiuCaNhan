import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface BodyScrollLockSnapshot {
  scrollY: number;
  overflow: string;
  overflowY: string;
  position: string;
  top: string;
  width: string;
  hadScrollLockedClass: boolean;
}

let lockCount = 0;
let snapshot: BodyScrollLockSnapshot | null = null;

function shouldUseFixedBodyLock() {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') return true;

  return /iP(ad|hone|od)/.test(window.navigator.userAgent)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
}

function lockBodyScroll() {
  const body = document.body;

  if (lockCount === 0) {
    const scrollY = window.scrollY;

    snapshot = {
      scrollY,
      overflow: body.style.overflow,
      overflowY: body.style.overflowY,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      hadScrollLockedClass: body.classList.contains('body-scroll-locked'),
    };

    body.classList.add('body-scroll-locked');
    body.style.overflow = 'hidden';

    if (shouldUseFixedBodyLock()) {
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflowY = 'scroll';
    }
  }

  lockCount += 1;
}

function unlockBodyScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0 || !snapshot) return;

  const body = document.body;
  const scrollY = snapshot.scrollY;

  body.style.overflow = snapshot.overflow;
  body.style.overflowY = snapshot.overflowY;
  body.style.position = snapshot.position;
  body.style.top = snapshot.top;
  body.style.width = snapshot.width;
  if (!snapshot.hadScrollLockedClass) {
    body.classList.remove('body-scroll-locked');
  }
  snapshot = null;

  window.scrollTo(0, scrollY);
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return undefined;

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}
