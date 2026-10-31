"use client";

import { useEffect } from "react";

export function MobileTapFeedback() {
  useEffect(() => {
    const active = new Map<HTMLElement, number>();
    let pointerStart: { x: number; y: number; id: number } | null = null;
    let suppressNextClick = false;
    const remove = (feedback: HTMLElement) => {
      window.clearTimeout(active.get(feedback));
      active.delete(feedback);
      feedback.remove();
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerStart = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
      };
      suppressNextClick = false;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      suppressNextClick =
        Math.hypot(
          event.clientX - pointerStart.x,
          event.clientY - pointerStart.y,
        ) > 10;
      pointerStart = null;
    };
    const onClick = (event: MouseEvent) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      if (
        !window.matchMedia("(max-width: 512px)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !(event.target instanceof Element)
      )
        return;
      const button = event.target.closest<HTMLElement>(
        'button, [role="button"], [role="menuitem"]',
      );
      if (!button || button.matches(':disabled, [aria-disabled="true"]'))
        return;
      const icon = button.querySelector<HTMLElement>("svg, img");
      if (!icon) return;
      const bounds = icon.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const size = Math.max(40, Math.max(bounds.width, bounds.height) + 16);
      const feedback = document.createElement("span");
      feedback.className = "mobile-tap-feedback";
      feedback.setAttribute("aria-hidden", "true");
      feedback.setAttribute("popover", "manual");
      Object.assign(feedback.style, {
        left: `${bounds.x + bounds.width / 2 - size / 2}px`,
        top: `${bounds.y + bounds.height / 2 - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      });
      document.body.append(feedback);
      feedback.showPopover?.();
      feedback.addEventListener("animationend", () => remove(feedback), {
        once: true,
      });
      active.set(
        feedback,
        window.setTimeout(() => remove(feedback), 500),
      );
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("click", onClick, true);
      active.forEach((_, feedback) => remove(feedback));
    };
  }, []);
  return null;
}
