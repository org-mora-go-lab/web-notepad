import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("1. DARK가 기본값이며 LIGHT로 전환하면 편집기와 패널 색상이 밝아진다", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await expect(page.getByRole("menuitemradio", { name: "DARK" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator(".workspace")).toHaveCSS("background-color", "rgb(250, 252, 251)");
    await expect(page.locator("textarea")).toHaveCSS("color", "rgb(32, 38, 36)");
    await expect(page.locator(".status-bar")).toHaveCSS("background-color", "rgb(240, 244, 241)");
    const colorIcon = page.locator(".tab-item.is-active .dirty-dot");
    const iconColor = () => colorIcon.evaluate(element => getComputedStyle(element, "::before").backgroundColor);
    const activeTab = page.locator(".tab-item.is-active");
    const inactiveBackground = () => activeTab.evaluate(element => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--tab-background)";
      element.appendChild(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });
    await expect.poll(iconColor).toBe("rgb(37, 131, 86)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(37, 131, 86, 0.18)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(37, 131, 86, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await expect.poll(iconColor).toBe("rgb(104, 119, 110)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(104, 119, 110, 0.18)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(104, 119, 110, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await expect(activeTab).toHaveCSS("background-color", "rgba(242, 139, 130, 0.16)");
    await colorIcon.click();
    await page.locator('[aria-controls="groups-panel"]').press("Enter");
    await expect(page.locator("#groups-panel")).toHaveCSS("background-color", "rgb(247, 250, 248)");
    await expect(page.locator("#groups-panel .search-field")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "DARK" }).click();
    await expect(page.locator(".workspace")).toHaveCSS("background-color", "rgb(17, 17, 16)");
    await expect.poll(iconColor).toBe("rgb(143, 227, 176)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(143, 227, 176, 0.16)");
  }
});