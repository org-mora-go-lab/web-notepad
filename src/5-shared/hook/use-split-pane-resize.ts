import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
} from "react";

const MIN_PANE_WIDTH = 280;
const DIVIDER_WIDTH = 8;

export function useSplitPaneResize(
  containerRef: RefObject<HTMLDivElement | null>,
  variableName: `--${string}`,
) {
  return useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || window.matchMedia("(max-width: 512px)").matches) return;
      event.preventDefault();
      const bounds = container.getBoundingClientRect();
      const handleMove = (moveEvent: PointerEvent) => {
        const maxLeftWidth = bounds.width - MIN_PANE_WIDTH - DIVIDER_WIDTH;
        const leftWidth = Math.min(
          Math.max(moveEvent.clientX - bounds.left, MIN_PANE_WIDTH),
          maxLeftWidth,
        );
        container.style.setProperty(variableName, `${Math.round(leftWidth)}px`);
      };
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [containerRef, variableName],
  );
}
