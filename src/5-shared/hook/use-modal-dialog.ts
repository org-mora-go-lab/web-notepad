import { useEffect, useRef } from "react";

export function useModalDialog(open: boolean, focusSelector?: string) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      if (focusSelector) {
        dialog.querySelector<HTMLElement>(focusSelector)?.focus();
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [focusSelector, open]);

  return dialogRef;
}
