import { expect, test } from "@playwright/test";

import { activeTabItem, addTabButton } from "../../__util__";

test("1. 새 탭의 기본 색상은 설정한 1번째 탭 색상이며 기본값은 그레이다", async ({ page }) => {
  await page.goto("/");
  const tab = activeTabItem(page);
  await expect(tab).toHaveAttribute("data-tab-color", "gray");
  await expect
    .poll(() =>
      tab.locator(".dirty-dot").evaluate(
        (button) => getComputedStyle(button, "::before").backgroundColor,
      ),
    )
    .toContain("rgb(184, 184, 176)");

  await tab.locator(".dirty-dot").click();
  await expect(tab).toHaveAttribute("data-tab-color", "green");
  await addTabButton(page).click();
  await expect(activeTabItem(page)).toHaveAttribute("data-tab-color", "gray");
});
