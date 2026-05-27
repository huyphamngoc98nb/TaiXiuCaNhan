import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const FOCUSABLE_INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const KEYBOARD_SAFE_GAP = 24;

function isEditableElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement && target.matches(FOCUSABLE_INPUT_SELECTOR);
}

function getScrollableParent(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const canScroll = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;
    if (canScroll) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

function scrollElementIntoKeyboardSafeView(element: HTMLElement) {
  const viewport = window.visualViewport;
  const visibleTop = viewport?.offsetTop ?? 0;
  const visibleBottom = visibleTop + (viewport?.height ?? window.innerHeight) - KEYBOARD_SAFE_GAP;
  const rect = element.getBoundingClientRect();

  if (rect.bottom <= visibleBottom && rect.top >= visibleTop + KEYBOARD_SAFE_GAP) {
    return;
  }

  const scrollParent = getScrollableParent(element);
  const delta = rect.bottom - visibleBottom;

  if (scrollParent && delta > 0) {
    scrollParent.scrollBy({ top: delta, behavior: 'smooth' });
    return;
  }

  element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
}

export function useKeyboardSafeFocus() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return;

    const viewport = window.visualViewport;
    let activeEditable: HTMLElement | null = null;
    let cleanupTimers: number[] = [];

    const updateViewportMetrics = () => {
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportOffsetTop = viewport?.offsetTop ?? 0;
      const keyboardInset = Math.max(0, window.innerHeight - viewportHeight - viewportOffsetTop);

      document.documentElement.style.setProperty('--visual-viewport-height', `${viewportHeight}px`);
      document.documentElement.style.setProperty('--keyboard-inset-bottom', `${keyboardInset}px`);
      document.body.classList.toggle('keyboard-open', keyboardInset > 80);
    };

    const clearScheduledScrolls = () => {
      cleanupTimers.forEach(timer => window.clearTimeout(timer));
      cleanupTimers = [];
    };

    const scheduleKeyboardSafeScroll = (element: HTMLElement) => {
      clearScheduledScrolls();
      [0, 120, 300, 520, 760].forEach((delay) => {
        cleanupTimers.push(window.setTimeout(() => {
          if (document.activeElement === element) {
            scrollElementIntoKeyboardSafeView(element);
          }
        }, delay));
      });
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!isEditableElement(event.target)) return;
      activeEditable = event.target;
      updateViewportMetrics();
      scheduleKeyboardSafeScroll(activeEditable);
    };

    const handleFocusOut = () => {
      activeEditable = null;
      clearScheduledScrolls();
      window.setTimeout(updateViewportMetrics, 100);
    };

    const handleViewportChange = () => {
      updateViewportMetrics();
      if (activeEditable && document.activeElement === activeEditable) {
        scheduleKeyboardSafeScroll(activeEditable);
      }
    };

    updateViewportMetrics();
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', handleViewportChange);
    viewport?.addEventListener('resize', handleViewportChange);
    viewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      clearScheduledScrolls();
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', handleViewportChange);
      viewport?.removeEventListener('resize', handleViewportChange);
      viewport?.removeEventListener('scroll', handleViewportChange);
      document.documentElement.style.removeProperty('--visual-viewport-height');
      document.documentElement.style.removeProperty('--keyboard-inset-bottom');
      document.body.classList.remove('keyboard-open');
    };
  }, []);
}
