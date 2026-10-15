import { useEffect, useRef } from "react";

export function useScrollableListLayout(variableName: `--${string}`) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const list = listRef.current;
    if (!container || !list) return;

    const update = () => {
      container.style.setProperty(
        variableName,
        `${list.offsetWidth - list.clientWidth}px`,
      );
      container.classList.toggle("is-scrolled", list.scrollTop > 0);
    };
    const observer = new ResizeObserver(update);
    observer.observe(list);
    update();
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
    };
  }, [variableName]);

  return { containerRef, listRef };
}
