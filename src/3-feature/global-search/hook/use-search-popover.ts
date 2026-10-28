import { useLayoutEffect, useRef } from "react";

export function useSearchPopover(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[aria-controls="global-search-popup"], .group-select-command',
      ),
    );
    const anchor =
      triggers.find(
        (element) =>
          element.classList.contains("group-select-command") &&
          element.getBoundingClientRect().width > 0,
      ) ??
      triggers.find((element) => element.getBoundingClientRect().width > 0);
    if (!dialog.open) dialog.showModal();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
      onClose();
      anchor?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, onClose]);

  return dialogRef;
}
