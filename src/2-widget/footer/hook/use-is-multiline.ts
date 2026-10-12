"use client";

import { type RefObject, useEffect, useState } from "react";

// True while the element's text wraps past one line, tracked across resizes and text changes.
export function useIsMultiline(ref: RefObject<HTMLElement | null>, text: string) {
  const [multiline, setMultiline] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      setMultiline(Number.isFinite(lineHeight) && element.clientHeight > lineHeight * 1.5);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, text]);

  return multiline;
}
