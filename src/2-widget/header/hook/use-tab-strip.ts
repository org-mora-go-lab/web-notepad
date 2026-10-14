"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTabStrip(tabCount: number, activeTabId: string) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [tabsOverflowing, setTabsOverflowing] = useState(false);
  const [tabsCanScrollLeft, setTabsCanScrollLeft] = useState(false);
  const [tabsCanScrollRight, setTabsCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const overflowing = scroller.scrollWidth > scroller.clientWidth;
    setTabsOverflowing(overflowing);
    setTabsCanScrollLeft(overflowing && scroller.scrollLeft > 0);
    setTabsCanScrollRight(
      overflowing &&
        scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaX !== 0 || event.deltaY === 0) return;

      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      if (maxScrollLeft <= 0) return;

      const deltaY =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * scroller.clientWidth
            : event.deltaY;
      const nextScrollLeft = Math.max(
        0,
        Math.min(maxScrollLeft, scroller.scrollLeft + deltaY),
      );
      if (nextScrollLeft === scroller.scrollLeft) return;

      event.preventDefault();
      scroller.scrollLeft = nextScrollLeft;
      updateScrollState();
    };

    updateScrollState();
    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    scroller.addEventListener("wheel", handleWheel, { passive: false });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateScrollState);
      scroller.removeEventListener("wheel", handleWheel);
      observer.disconnect();
    };
  }, [tabCount, updateScrollState]);

  useEffect(() => {
    const activeTab = tabsScrollRef.current?.querySelector<HTMLElement>(
      ".tab-item.is-active",
    );
    if (!activeTab) return;

    const keepActiveTabVisible = () => {
      activeTab.scrollIntoView({ block: "nearest", inline: "nearest" });
      updateScrollState();
    };

    keepActiveTabVisible();
    const observer = new ResizeObserver(keepActiveTabVisible);
    observer.observe(activeTab);
    return () => observer.disconnect();
  }, [activeTabId, updateScrollState]);

  return {
    tabsScrollRef,
    tabsOverflowing,
    tabsCanScrollLeft,
    tabsCanScrollRight,
  };
}
