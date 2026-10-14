import type { KeyboardEvent, ReactNode } from "react";

export type ConfirmPopupProps = {
  title: string;
  message: string;
  closeLabel: string;
  closeTitle: string;
  // Defaults to a "Delete" action with a trash icon.
  confirmLabel?: string;
  confirmIcon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLDialogElement>,
    close: (action: () => void) => void,
  ) => boolean;
};
