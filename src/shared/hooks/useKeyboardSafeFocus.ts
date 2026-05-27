import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const FOCUSABLE_INPUT_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const KEYBOARD_SAFE_GAP = 24;
const KEYBOARD_SCROLL_PADDING = 96;

interface ScrollPaddingState {
  element: HTMLElement;
  basePaddingBottom: number;
  previousPaddingBottom: string;
  previousScrollPaddingBottom: string;
  previousOverflowY: string;
  previousWebkitOverflowScrolling: string;
}

function isEditableElement(target: EventTarget | null): target is HTMLElement {
  if (!(target instanceof HTMLElement) || !target.matches(FOCUSABLE_INPUT_SELECTOR)) {
    return false;
  }

  if (target.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  if (target instanceof HTMLInputElement && (target.type === 'file' || target.type === 'hidden')) {
    return false;
  }

  return true;
}

function getKeyboardScrollContainer(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const canScroll = /(auto|scroll)/.test(style.overflowY);
    if (canScroll) {
      return current;
    }
    current = current.parentElement;
  }

  return element.closest<HTMLElement>('.keyboard-safe-bottom-sheet, form, .main-content');
}

function applyKeyboardScrollPadding(
  scrollParent: HTMLElement | null,
  keyboardInset: number,
  currentState: ScrollPaddingState | null,
): ScrollPaddingState | null {
  if (!scrollParent) {
    return currentState;
  }

  let nextState = currentState;

  if (!nextState || nextState.element !== scrollParent) {
    if (nextState) {
      restoreScrollPadding(nextState);
    }

    nextState = {
      element: scrollParent,
      basePaddingBottom: Number.parseFloat(window.getComputedStyle(scrollParent).paddingBottom) || 0,
      previousPaddingBottom: scrollParent.style.paddingBottom,
      previousScrollPaddingBottom: scrollParent.style.scrollPaddingBottom,
      previousOverflowY: scrollParent.style.overflowY,
      previousWebkitOverflowScrolling: scrollParent.style.getPropertyValue('-webkit-overflow-scrolling'),
    };
  }

  const safePadding = keyboardInset > 0 ? keyboardInset + KEYBOARD_SCROLL_PADDING : 0;
  scrollParent.style.paddingBottom = `${nextState.basePaddingBottom + safePadding}px`;
  scrollParent.style.scrollPaddingBottom = `${safePadding + KEYBOARD_SAFE_GAP}px`;
  scrollParent.style.overflowY = 'auto';
  scrollParent.style.setProperty('-webkit-overflow-scrolling', 'touch');

  return nextState;
}

function restoreScrollPadding(state: ScrollPaddingState) {
  state.element.style.paddingBottom = state.previousPaddingBottom;
  state.element.style.scrollPaddingBottom = state.previousScrollPaddingBottom;
  state.element.style.overflowY = state.previousOverflowY;
  if (state.previousWebkitOverflowScrolling) {
    state.element.style.setProperty('-webkit-overflow-scrolling', state.previousWebkitOverflowScrolling);
  } else {
    state.element.style.removeProperty('-webkit-overflow-scrolling');
  }
}

function scrollElementIntoKeyboardSafeView(element: HTMLElement) {
  const viewport = window.visualViewport;
  const visibleTop = viewport?.offsetTop ?? 0;
  const visibleBottom = visibleTop + (viewport?.height ?? window.innerHeight) - KEYBOARD_SAFE_GAP;
  const rect = element.getBoundingClientRect();

  if (rect.bottom <= visibleBottom && rect.top >= visibleTop + KEYBOARD_SAFE_GAP) {
    return;
  }

  const scrollParent = getKeyboardScrollContainer(element);
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
    let activeScrollPadding: ScrollPaddingState | null = null;
    let cleanupTimers: number[] = [];
    let keyboardInset = 0;

    const updateViewportMetrics = () => {
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportOffsetTop = viewport?.offsetTop ?? 0;
      keyboardInset = Math.max(0, window.innerHeight - viewportHeight - viewportOffsetTop);

      document.documentElement.style.setProperty('--visual-viewport-height', `${viewportHeight}px`);
      document.documentElement.style.setProperty('--keyboard-inset-bottom', `${keyboardInset}px`);
      document.body.classList.toggle('keyboard-open', keyboardInset > 80);

      if (activeEditable) {
        activeScrollPadding = applyKeyboardScrollPadding(
          getKeyboardScrollContainer(activeEditable),
          keyboardInset,
          activeScrollPadding,
        );
      }
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
      activeScrollPadding = applyKeyboardScrollPadding(
        getKeyboardScrollContainer(activeEditable),
        keyboardInset,
        activeScrollPadding,
      );
      scheduleKeyboardSafeScroll(activeEditable);
    };

    const handleFocusOut = () => {
      activeEditable = null;
      clearScheduledScrolls();
      if (activeScrollPadding) {
        restoreScrollPadding(activeScrollPadding);
        activeScrollPadding = null;
      }
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
      if (activeScrollPadding) {
        restoreScrollPadding(activeScrollPadding);
      }
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
