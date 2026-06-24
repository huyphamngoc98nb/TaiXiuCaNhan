import React from 'react';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title = 'Confirmation',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  hideCancel = false
}) => {
  useBodyScrollLock(true);

  return (
    <div className="confirm-overlay" onClick={hideCancel ? undefined : onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="confirm-content">
          {title && <h3 className="confirm-title">{title}</h3>}
          <p className="confirm-message">{message}</p>
        </div>
        <div className="confirm-actions">
          {!hideCancel && (
            <button className="confirm-button" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="confirm-button confirm-button-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
