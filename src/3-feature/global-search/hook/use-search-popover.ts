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
        '[aria-controls="global-search-popup"], .more-command',
      ),
    );
    const anchor =
      triggers.find((element) => element === document.activeElement) ??
      triggers.find((element) => element.getBoundingClientRect().width > 0);
    const firstOpen = !dialog.open;
    if (firstOpen) dialog.show();
    const position = () => {
      const viewport = window.visualViewport;
      const viewportBottom =
        (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0);
      const footerHeight =
        document.querySelector(".footer")?.getBoundingClientRect().height ?? 48;
      dialog.style.setProperty(
        "--global-search-available-height",
        Math.max(
          100,
          (viewport?.height ?? window.innerHeight) - footerHeight - 24,
        ) + "px",
      );
      const top = Math.max(
        (viewport?.offsetTop ?? 0) + 8,
        viewportBottom - footerHeight - 8 - dialog.offsetHeight,
      );
      const right =
        (viewport?.offsetLeft ?? 0) +
        (viewport?.width ?? window.innerWidth) -
        16;
      dialog.style.top = top + "px";
      dialog.style.left =
        Math.max((viewport?.offsetLeft ?? 0) + 16, right - dialog.offsetWidth) +
        "px";
    };
    position();
    if (firstOpen)
      dialog
        .querySelector<HTMLInputElement>('input[type="search"]')
        ?.focus({ preventScroll: true });
    const observer = new ResizeObserver(position);
    observer.observe(dialog);
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
    window.addEventListener("resize", position);
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("scroll", position);
    };
  }, [open, onClose]);

  return dialogRef;
}
