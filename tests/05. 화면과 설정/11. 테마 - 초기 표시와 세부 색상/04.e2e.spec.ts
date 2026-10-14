import { expect, test } from "@playwright/test";

test("4. 저장된 테마를 DOMContentLoaded 전에 data-theme에 반영한다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("web-notepad-theme", "light");
    document.addEventListener("DOMContentLoaded", () => {
      (window as typeof window & { __themeAtDomReady?: string }).__themeAtDomReady =
        document.documentElement.dataset.theme;
    }, { once: true });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect.poll(() => page.evaluate(
    () => (window as typeof window & { __themeAtDomReady?: string }).__themeAtDomReady,
  )).toBe("light");
});
