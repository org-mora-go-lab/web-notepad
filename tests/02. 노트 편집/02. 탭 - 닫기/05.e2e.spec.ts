import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../../__util__";

test("5. 긴 탭은 닫기 버튼 뒤 확인 팝업에서 Close를 선택해야 닫힌다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await page.locator("textarea").fill("12345678901");
  await addTabButton(page).click();

  await tabs.first().locator(".tab-close").click();
  const popup = deleteTabPopup(page);
  await expect(popup).toContainText("Do you want to close this tab?");
  await expect(tabs).toHaveCount(2);
  await popup.getByRole("button", { name: "Close", exact: true }).click();
  await expect(tabs).toHaveCount(1);
});
