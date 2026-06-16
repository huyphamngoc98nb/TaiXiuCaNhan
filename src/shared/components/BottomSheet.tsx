import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { registerAppBackHandler } from '@/shared/utils/app-back-stack';
import { logAppError } from '@/core/telemetry/error.service';

const SHEET_TRANSITION_MS = 220;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreenOnAndroid?: boolean;
  transitionKey?: string | number;
  onExited?: () => void;
  logContext?: string;
}

type SheetTransitionState = 'entering' | 'entered' | 'exiting';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scheduleNextFrame(callback: () => void): number {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(callback, 16);
}

function cancelNextFrame(id: number | undefined) {
  if (id === undefined) return;

  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(id);
    return;
  }

  window.clearTimeout(id);
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  fullScreenOnAndroid = false,
  transitionKey,
  onExited,
  logContext = 'BottomSheet',
}: Props) {
  const isFullScreen = fullScreenOnAndroid && Capacitor.getPlatform() === 'android';
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(isOpen);
  const [transitionState, setTransitionState] = useState<SheetTransitionState>(
    isOpen ? 'entering' : 'exiting',
  );
  const [renderedChildren, setRenderedChildren] = useState(children);
  const activeKeyRef = useRef(transitionKey);
  const timeoutRef = useRef<number>();
  const rafRef = useRef<number>();
  const isClosingRef = useRef(false);
  const onExitedRef = useRef(onExited);

  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  const requestClose = useCallback(() => {
    if (!isOpen || transitionState === 'exiting' || isClosingRef.current) {
      if (isOpen && Capacitor.getPlatform() === 'android') {
        void logAppError(new Error('sheet_state_desync'), {
          component: logContext,
          action: 'sheet_state_desync',
          extra: {
            isOpen,
            transitionState,
            transitionKey,
            isClosing: isClosingRef.current,
          },
        });
      }
      return;
    }
    isClosingRef.current = true;
    onClose();
  }, [isOpen, logContext, onClose, transitionKey, transitionState]);

  useBodyScrollLock(isMounted);

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
      cancelNextFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    sheet.scrollTop = 0;
    sheet.querySelectorAll<HTMLElement>('[data-modal-scroll-container="true"]').forEach((element) => {
      element.scrollTop = 0;
    });
  }, [isOpen]);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    cancelNextFrame(rafRef.current);

    const duration = prefersReducedMotion() ? 1 : SHEET_TRANSITION_MS;

    if (isOpen) {
      isClosingRef.current = false;
      setIsMounted(true);
      setTransitionState('entering');
      rafRef.current = scheduleNextFrame(() => setTransitionState('entered'));
      return;
    }

    if (!isMounted) {
      setTransitionState('exiting');
      return;
    }

    setTransitionState('exiting');
    timeoutRef.current = window.setTimeout(() => {
      setIsMounted(false);
      isClosingRef.current = false;
      onExitedRef.current?.();
    }, duration);
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (isMounted && (!isOpen || transitionState === 'exiting')) {
      return;
    }

    if (!isMounted || activeKeyRef.current === transitionKey) {
      setRenderedChildren(children);
      activeKeyRef.current = transitionKey;
      return;
    }

    window.clearTimeout(timeoutRef.current);
    cancelNextFrame(rafRef.current);

    const duration = prefersReducedMotion() ? 1 : SHEET_TRANSITION_MS;
    setTransitionState('exiting');
    timeoutRef.current = window.setTimeout(() => {
      activeKeyRef.current = transitionKey;
      setRenderedChildren(children);
      setTransitionState('entering');
      rafRef.current = scheduleNextFrame(() => setTransitionState('entered'));
    }, duration);
  }, [children, isMounted, isOpen, transitionKey, transitionState]);

  useEffect(() => {
    if (!isOpen) return undefined;

    return registerAppBackHandler(() => {
      if (Capacitor.getPlatform() === 'android') {
        void logAppError(new Error('android_back_during_form_transition'), {
          component: logContext,
          action: 'android_back_during_form_transition',
          extra: {
            transitionState,
            transitionKey,
            isClosing: isClosingRef.current,
          },
        });
      }
      requestClose();
      return true;
    });
  }, [isOpen, logContext, requestClose, transitionKey, transitionState]);

  if (!isMounted) return null;

  const sheetClassName = [
    'bottom-sheet-panel keyboard-safe-bottom-sheet form-scroll-container relative flex max-h-full w-full flex-col bg-surface text-text p-6 shadow-2xl',
    isFullScreen
      ? 'keyboard-safe-bottom-sheet--fullscreen max-w-none rounded-none'
      : 'max-w-md rounded-t-[24px]',
  ].join(' ');

  return (
    <div
      className="bottom-sheet-overlay fixed inset-0 z-[100] flex items-end justify-center overflow-hidden overscroll-contain"
      data-state={transitionState}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 touch-none bg-black/40 backdrop-blur-[2px]"
        onClick={requestClose}
      />

      {/* Sheet */}
      <div ref={sheetRef} className={sheetClassName}>
        {/* Drag Handle */}
        {!isFullScreen && (
          <div className="w-8 h-1 bg-border rounded-full mx-auto mb-6" onClick={requestClose} />
        )}

        <div className="min-h-0 flex-1 pb-8">{renderedChildren}</div>
      </div>
    </div>
  );
}
