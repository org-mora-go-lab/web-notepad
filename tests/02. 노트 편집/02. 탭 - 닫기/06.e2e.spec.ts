import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup } from "../../__util__";

test("6. 긴 탭은 가운데 클릭으로 닫을 때도 확인 팝업을 거친다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await page.locator("textarea").fill("12345678901");
  await addTabButton(page).click();

  await tabs.first().getByRole("tab").click({ button: "middle" });
  const popup = deleteTabPopup(page);
  await expect(popup).toContainText("Do you want to close this tab?");
  await expect(tabs).toHaveCount(2);
  await popup.getByRole("button", { name: "Close", exact: true }).click();
  await expect(tabs).toHaveCount(1);
});
