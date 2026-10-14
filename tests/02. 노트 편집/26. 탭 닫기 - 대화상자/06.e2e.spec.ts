import { expect, test } from "@playwright/test";

import { activeTabItem, deleteTabPopup } from "../../__util__";
import { requestInactiveTabDelete } from "../02. 탭 - 닫기/__util__";

test("6. 탭 삭제 팝업이 열린 동안 다른 탭 조작 단축키를 무시한다", async ({ page }) => {
  await page.goto("/");
  await requestInactiveTabDelete(page);
  const tabs = page.locator(".tab-item");
  const popup = deleteTabPopup(page);

  await page.keyboard.press("Alt+Tab");
  await page.keyboard.press("Alt+ArrowUp");
  await page.keyboard.press("Alt+F12");

  await expect(popup).toBeVisible();
  await expect(tabs).toHaveCount(2);
  await expect(activeTabItem(page)).toHaveCount(1);
  await expect(tabs.last()).toHaveClass(/is-active/);
  await expect(tabs.first().locator(".tab-title")).toHaveText("Target note");
  await expect(tabs.last().locator(".tab-title")).toHaveText("Keep the active note");
});
