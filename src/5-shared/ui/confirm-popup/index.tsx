"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

import { useConfirmDialog, useI18n } from "../../hook";
import type { ConfirmPopupProps } from "./type";

// Confirmation dialog with Cancel focused first and a destructive confirm action (Delete by default).
export function ConfirmPopup({
  title,
  message,
  closeLabel,
  closeTitle,
  confirmLabel,
  keepOpenOnConfirm = false,
  error,
  confirmIcon,
  onConfirm,
  onCancel,
  onKeyDown,
}: ConfirmPopupProps) {
  const { dialogProps, cancelButtonRef, popupId, close } = useConfirmDialog({
    onCancel,
    onKeyDown,
  });
  const { t } = useI18n();

  return (
    <dialog className="confirm-popup" {...dialogProps}>
      <div className="confirm-popup-content">
        <div className="confirm-popup-header">
          <div className="confirm-popup-title">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id={`${popupId}-title`}>{title}</h3>
          </div>
          <button
            className="confirm-popup-close"
            type="button"
            aria-label={closeLabel}
            title={closeTitle}
            onClick={() => close(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>{message}</p>
        {error && (
          <p className="confirm-popup-error" role="alert">
            {error}
          </p>
        )}
        <div className="confirm-popup-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={() => close(onCancel)}
          >
            <X size={14} aria-hidden="true" />
            {t.cancel}
          </button>
          <button
            className="confirm-popup-confirm"
            type="button"
            onClick={() => (keepOpenOnConfirm ? onConfirm() : close(onConfirm))}
          >
            {confirmIcon ?? <Trash2 size={14} aria-hidden="true" />}
            {confirmLabel ?? t.delete}
          </button>
        </div>
      </div>
    </dialog>
  );
}
