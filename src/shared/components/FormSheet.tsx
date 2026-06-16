import React, { useEffect, useRef } from 'react';
import { BottomSheet } from './BottomSheet';
import { logAppError } from '@/core/telemetry/error.service';

interface FormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  transitionKey?: string | number;
  fullScreenOnAndroid?: boolean;
  onExited?: () => void;
  logContext?: string;
}

export function FormSheet({
  isOpen,
  onClose,
  children,
  title,
  transitionKey,
  fullScreenOnAndroid,
  onExited,
  logContext = 'FormSheet',
}: FormSheetProps) {
  const missingDataLoggedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      missingDataLoggedRef.current = false;
      return;
    }

    if (children != null || missingDataLoggedRef.current) return;

    missingDataLoggedRef.current = true;
    void logAppError(new Error('form_open_without_data'), {
      component: logContext,
      action: 'form_open_without_data',
      extra: {
        title,
        transitionKey,
      },
    });
    onClose();
  }, [children, isOpen, logContext, onClose, title, transitionKey]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      onExited={onExited}
      fullScreenOnAndroid={fullScreenOnAndroid}
      transitionKey={transitionKey}
      logContext={logContext}
    >
      {children}
    </BottomSheet>
  );
}
