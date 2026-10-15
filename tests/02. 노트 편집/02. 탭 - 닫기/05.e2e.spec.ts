import { expect, test } from "@playwright/test";

import { addTabButton, readStoredState } from "../../__util__";

test("5. 내용이 있는 탭도 닫기 버튼으로 확인 없이 바로 닫는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await page.locator("textarea").fill("12345678901");
  await addTabButton(page).click();

  await tabs.first().locator(".tab-close").click();
  await expect(tabs).toHaveCount(1);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.[0].tab.content).toBe("12345678901");
});
