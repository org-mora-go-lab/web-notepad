import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { selectTabColorSetting } from "../../__util__";

test("7. LIGHT의 그레이·그린 아이콘 강조색과 레드·DARK 탭 색상을 유지한다", async ({ page }) => {
  await page.goto("/");
  await selectTabColorSetting(page, 3, "Red");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("menuitemradio", { name: "LIGHT" }).click();

    const activeTab = page.locator(".tab-item.is-active");
    const colorIcon = activeTab.locator(".dirty-dot");
    const iconColor = () =>
      colorIcon.evaluate((element) => getComputedStyle(element, "::before").backgroundColor);
    await expect.poll(iconColor).toBe("rgb(104, 119, 110)");
    await colorIcon.click();
    await expect.poll(iconColor).toBe("rgb(37, 131, 86)");
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
