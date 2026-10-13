import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, openClosedPanel, readStoredState } from "../__util__";

test("9. 닫은 탭 삭제 버튼은 확인 팝업 없이 즉시 영구 삭제한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "remove this note");
  await openClosedPanel(page);

  let nativeDialogOpened = false;
  page.on("dialog", async (dialog) => {
    nativeDialogOpened = true;
    await dialog.dismiss();
  });
  await page.locator(".closed-item .remove-closed").click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.locator(".closed-item")).toHaveCount(0);
  expect(nativeDialogOpened).toBe(false);
  expect((await readStoredState(page)).closedTabs).toEqual([]);
});
