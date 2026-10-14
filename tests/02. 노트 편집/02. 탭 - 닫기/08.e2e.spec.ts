import { expect, test } from "@playwright/test";

import { addTabButton, deleteTabPopup, readStoredState } from "../../__util__";

test("8. 내용이 10자 이하인 탭은 확인과 보관 없이 닫는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Keep this note");
  await addTabButton(page).click();
  await editor.fill("1234567890");

  await page.locator(".tab-item").last().locator(".tab-close").click();
  await expect(deleteTabPopup(page)).toHaveCount(0);
  await expect(editor).toHaveValue("Keep this note");
  await expect.poll(async () => (await readStoredState(page)).closedTabs ?? []).toEqual([]);
});
