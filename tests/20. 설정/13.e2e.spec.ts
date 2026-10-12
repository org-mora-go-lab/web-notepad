import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";
import { openPanel, openSettingsPanel } from "../__util__";
import { settingsPanel } from "./__util__";

test("13. Language 아래 Panel Slide에서 On·Off를 선택하며 기본값 Off는 우측 패널을 슬라이드 효과 없이 열고 닫고 선택은 새로고침 후에도 유지한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "off");
  const bookmarks = page.locator("#bookmarks-panel");
  await expect(bookmarks).toHaveCSS("transition-duration", "0s");
  await openPanel(page, "bookmarks-panel");
  // Measured right after opening: without a slide the drawer is already in place.
  const offsetRight = await bookmarks.evaluate((element) => window.innerWidth - element.getBoundingClientRect().right);
  expect(offsetRight).toBeCloseTo(0, 0);
  await page.keyboard.press("Escape");

  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const headings = panel.locator(".setting-section h3");
  await expect(headings.nth(2)).toHaveText("Language");
  await expect(headings.nth(3)).toHaveText("Panel Slide");
  const on = panel.getByRole("radio", { name: "On", exact: true });
  const off = panel.getByRole("radio", { name: "Off", exact: true });
  await expect(off).toBeChecked();

  await on.check();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "on");
  await expect(panel).toHaveCSS("transition-duration", "0.22s");
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings.panelSlide, STORAGE_KEY))
    .toBe(true);

  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "on");
  // The open settings panel is restored from the URL on reload.
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(on).toBeChecked();
  await off.check();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "off");
  await expect(panel).toHaveCSS("transition-duration", "0s");
});
