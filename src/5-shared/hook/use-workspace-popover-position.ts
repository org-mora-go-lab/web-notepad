import { type RefObject, useLayoutEffect } from "react";

export function useWorkspacePopoverPosition(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
) {
  useLayoutEffect(() => {
    const popup = ref.current;
    const footer = document.querySelector<HTMLElement>(".footer");
    if (!open || !popup || !footer) return;
    const place = () => {
      const viewport = window.visualViewport;
      const topEdge = (viewport?.offsetTop ?? 0) + 8;
      const leftEdge = (viewport?.offsetLeft ?? 0) + 16;
      const viewportRight =
        (viewport?.offsetLeft ?? 0) +
        (viewport?.width ?? window.innerWidth) -
        16;
      const bounds = footer.getBoundingClientRect();
      const available = Math.max(100, bounds.top - topEdge - 8);
      popup.style.maxWidth =
        Math.min(viewportRight - leftEdge, Math.max(100, bounds.width - 32)) +
        "px";
      popup.style.maxHeight = available + "px";
      popup.style.setProperty(
        "--global-search-available-height",
        available + "px",
      );
      popup.style.bottom = "auto";
      popup.style.top =
        Math.max(topEdge, bounds.top - 8 - popup.offsetHeight) + "px";
      popup.style.right = "auto";
      popup.style.left =
        Math.max(
          leftEdge,
          Math.min(viewportRight, bounds.right - 16) - popup.offsetWidth,
        ) + "px";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(footer);
    observer.observe(popup);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [open, ref]);
}
