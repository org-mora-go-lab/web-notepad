import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";

test("1. SETTINGS의 FONT SIZE 위 THEME 토글은 좌우로 이동하며 DARK와 LIGHT를 전환한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openSettingsPanel(page);
    const headings = page.locator("#settings-panel .setting-section h3");
    await expect(headings.nth(0)).toHaveText("THEME");
    await expect(headings.nth(1)).toHaveText("Font Size");
    await expect(headings.nth(0).locator("svg")).toHaveCount(1);
    const toggle = page.getByRole("switch", { name: "THEME" });
    const thumbX = () => toggle.evaluate((element) => {
      const track = element.nextElementSibling!;
      return new DOMMatrix(getComputedStyle(track, "::after").transform).m41;
    });
    await expect(toggle).not.toBeChecked();
    await expect.poll(thumbX).toBe(0);
    const leftInset = await toggle.evaluate((element) =>
      parseFloat(getComputedStyle(element.nextElementSibling!, "::after").left),
    );
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
    await expect(toggle).toBeChecked();
    await expect.poll(() => toggle.evaluate((element) => {
      const track = element.nextElementSibling!;
      const trackStyle = getComputedStyle(track);
      const thumbStyle = getComputedStyle(track, "::after");
      const innerWidth = track.getBoundingClientRect().width
        - parseFloat(trackStyle.borderLeftWidth) - parseFloat(trackStyle.borderRightWidth);
      const thumbLeft = parseFloat(thumbStyle.left) + new DOMMatrix(thumbStyle.transform).m41;
      return innerWidth - thumbLeft - parseFloat(thumbStyle.width);
    })).toBeCloseTo(leftInset, 1);
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect.poll(thumbX).toBe(0);
    await page.getByRole("button", { name: "Close Settings" }).click();
  }
});
