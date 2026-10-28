import { useLayoutEffect, useRef } from "react";

import { useWorkspacePopoverPosition } from "@/src/5-shared/hook";

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
        '[aria-controls="global-search-popup"], .more-command',
      ),
    );
    const anchor =
      triggers.find((element) => element === document.activeElement) ??
      triggers.find((element) => element.getBoundingClientRect().width > 0);
    const firstOpen = !dialog.open;
    if (firstOpen) dialog.show();
    if (firstOpen)
      dialog
        .querySelector<HTMLInputElement>('input[type="search"]')
        ?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (
        !dialog.contains(event.target) &&
        !triggers.some((trigger) => trigger.contains(event.target as Node))
      ) {
        dialog.close();
        onClose();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
      onClose();
      anchor?.focus({ preventScroll: true });
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open, onClose]);

  useWorkspacePopoverPosition(dialogRef, open);
  return dialogRef;
}
