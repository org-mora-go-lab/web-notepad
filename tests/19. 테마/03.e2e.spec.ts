import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { selectTabColorSetting } from "../__util__";

test("3. LIGHT의 그레이·그린 탭 배경은 더 진하게, 활성 탭은 22%로 표시하고 아이콘 강조색·레드 탭·DARK 색상은 유지한다", async ({ page }) => {
  await page.goto("/");
  // The default 3rd color is Purple, so put Red in the 3rd slot to check the red tab.
  await selectTabColorSetting(page, 3, "Red");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
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
    await expect.poll(iconColor).toBe("rgb(104, 119, 110)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(104, 119, 110, 0.22)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(104, 119, 110, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await expect.poll(iconColor).toBe("rgb(37, 131, 86)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(37, 131, 86, 0.22)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(37, 131, 86, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await expect(activeTab).toHaveCSS("background-color", "rgba(242, 139, 130, 0.16)");
    await colorIcon.click();
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "DARK" }).click();
    await expect.poll(iconColor).toBe("rgb(184, 184, 176)");
    await expect(activeTab).toHaveCSS("background-color", "rgba(184, 184, 176, 0.16)");
  }
});
