import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import { registerAppBackHandler } from '@/shared/utils/app-back-stack';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreenOnAndroid?: boolean;
}

export function BottomSheet({ isOpen, onClose, children, fullScreenOnAndroid = false }: Props) {
  const isFullScreen = fullScreenOnAndroid && Capacitor.getPlatform() === 'android';
  const sheetRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

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
    if (!isOpen) return undefined;

    return registerAppBackHandler(() => {
      onClose();
      return true;
    });
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sheetClassName = [
    'keyboard-safe-bottom-sheet form-scroll-container relative flex max-h-full w-full flex-col bg-surface text-text p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out',
    isFullScreen
      ? 'keyboard-safe-bottom-sheet--fullscreen max-w-none rounded-none'
      : 'max-w-md rounded-t-[24px]',
  ].join(' ');

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden overscroll-contain animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 touch-none bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div ref={sheetRef} className={sheetClassName}>
        {/* Drag Handle */}
        {!isFullScreen && (
          <div className="w-8 h-1 bg-border rounded-full mx-auto mb-6" onClick={onClose} />
        )}

        <div className="min-h-0 flex-1 pb-8">{children}</div>
      </div>
    </div>
  );
}
