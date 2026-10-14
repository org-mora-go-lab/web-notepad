import { useEffect, useRef } from "react";

export function useDashboardScroll() {
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const list = listRef.current;
    const board = boardRef.current;
    if (!content || !list || !board) return;

    const updateScrollbarWidth = () => {
      content.style.setProperty(
        "--dashboard-scrollbar-width",
        `${list.offsetWidth - list.clientWidth}px`,
      );
      updateScrollState();
    };
    const updateScrollState = () =>
      content.classList.toggle("is-scrolled", list.scrollTop > 0);
    const observer = new ResizeObserver(updateScrollbarWidth);
    observer.observe(list);
    observer.observe(board);
    updateScrollbarWidth();
    list.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return { contentRef, listRef, boardRef };
}
