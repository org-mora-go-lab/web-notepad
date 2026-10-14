import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("3. LIGHT의 그레이·그린 탭은 일반 10%·활성 22% 배경으로 표시한다", async ({ page }) => {
  await page.goto("/");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();

    const activeTab = page.locator(".tab-item.is-active");
    const colorIcon = activeTab.locator(".dirty-dot");
    const inactiveBackground = () => activeTab.evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--tab-background)";
      element.appendChild(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });

    await expect(activeTab).toHaveCSS("background-color", "rgba(104, 119, 110, 0.22)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(104, 119, 110, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await expect(activeTab).toHaveCSS("background-color", "rgba(37, 131, 86, 0.22)");
    await expect.poll(inactiveBackground).toMatch(/^rgba\(37, 131, 86, 0\.1(?:02)?\)$/);
    await colorIcon.click();
    await colorIcon.click();
  }
});
