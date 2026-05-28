import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerAppBackHandler } from '@/shared/utils/app-back-stack';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreenOnAndroid?: boolean;
}

export function BottomSheet({ isOpen, onClose, children, fullScreenOnAndroid = false }: Props) {
  const isFullScreen = fullScreenOnAndroid && Capacitor.getPlatform() === 'android';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
    'keyboard-safe-bottom-sheet relative flex w-full flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 ease-out overflow-y-auto',
    isFullScreen
      ? 'keyboard-safe-bottom-sheet--fullscreen max-w-none rounded-none'
      : 'max-w-md rounded-t-[24px]',
  ].join(' ');

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div className={sheetClassName}>
        {/* Drag Handle */}
        {!isFullScreen && (
          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-6" onClick={onClose} />
        )}

        <div className="min-h-0 flex-1 pb-8">{children}</div>
      </div>
    </div>
  );
}
