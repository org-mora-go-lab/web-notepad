import type { RefObject } from "react";

const measureCaretPosition = (
  textarea: HTMLTextAreaElement,
  style: CSSStyleDeclaration,
  lineHeight: number,
  paddingTop: number,
  paddingBottom: number,
) => {
  const mirror = textarea.cloneNode() as HTMLTextAreaElement;
  mirror.setAttribute("aria-hidden", "true");
  mirror.value = textarea.value.slice(0, textarea.selectionStart);
  for (const property of style) {
    mirror.style.setProperty(property, style.getPropertyValue(property));
  }
  Object.assign(mirror.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: `${textarea.clientWidth}px`,
    height: "0",
    minHeight: "0",
    overflow: "hidden",
    visibility: "hidden",
    pointerEvents: "none",
    transform: "none",
  });
  document.body.append(mirror);
  const caretBottom = mirror.scrollHeight - paddingBottom;
  mirror.remove();
  return {
    top: Math.max(paddingTop, caretBottom - lineHeight),
    bottom: caretBottom,
  };
};

export function useEditorCaretScroll(
  lineRailRef: RefObject<HTMLDivElement | null>,
) {
  return (textarea: HTMLTextAreaElement) => {
    window.requestAnimationFrame(() => {
      if (!textarea.isConnected) return;

      const style = window.getComputedStyle(textarea);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const paddingTop = Number.parseFloat(style.paddingTop);
      const paddingBottom = Number.parseFloat(style.paddingBottom);
      if (![lineHeight, paddingTop, paddingBottom].every(Number.isFinite))
        return;

      const caret = measureCaretPosition(
        textarea,
        style,
        lineHeight,
        paddingTop,
        paddingBottom,
      );
      const visibleTop = textarea.scrollTop + paddingTop;
      const visibleBottom =
        textarea.scrollTop + textarea.clientHeight - paddingBottom;

      let nextScrollTop = textarea.scrollTop;
      if (caret.bottom > visibleBottom) {
        nextScrollTop =
          caret.bottom - textarea.clientHeight + paddingBottom;
      } else if (caret.top < visibleTop) {
        nextScrollTop = caret.top - paddingTop;
      }

      nextScrollTop = Math.max(
        0,
        Math.min(nextScrollTop, textarea.scrollHeight - textarea.clientHeight),
      );
      if (nextScrollTop === textarea.scrollTop) return;

      textarea.scrollTop = nextScrollTop;
      if (lineRailRef.current) lineRailRef.current.scrollTop = nextScrollTop;
    });
  };
}
