"use client";

import { useEffect } from "react";

export function MobileTapFeedback() {
  useEffect(() => {
    const active = new Map<HTMLElement, number>();
    const remove = (ripple: HTMLElement) => {
      window.clearTimeout(active.get(ripple));
      active.delete(ripple);
      ripple.remove();
    };
    const onClick = (event: MouseEvent) => {
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
      const icon = button.querySelector("svg");
      if (!icon) return;
      const bounds = icon.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const size = Math.max(40, Math.max(bounds.width, bounds.height) + 16);
      const ripple = document.createElement("span");
      ripple.className = "mobile-tap-feedback";
      ripple.setAttribute("aria-hidden", "true");
      ripple.setAttribute("popover", "manual");
      Object.assign(ripple.style, {
        left: `${bounds.x + bounds.width / 2 - size / 2}px`,
        top: `${bounds.y + bounds.height / 2 - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      });
      document.body.append(ripple);
      // The top layer avoids toolbar clipping and keeps feedback above existing dialogs.
      ripple.showPopover?.();
      ripple.addEventListener("animationend", () => remove(ripple), {
        once: true,
      });
      active.set(
        ripple,
        window.setTimeout(() => remove(ripple), 500),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      active.forEach((_, ripple) => remove(ripple));
    };
  }, []);
  return null;
}
