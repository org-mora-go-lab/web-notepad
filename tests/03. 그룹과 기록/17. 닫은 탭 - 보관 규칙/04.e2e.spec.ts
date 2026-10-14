import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedContents, openClosedPanel } from "../../__util__";

test("4. 닫은 탭 목록은 새로고침 후에도 유지한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "persisted closed note");
  await page.reload();
  await openClosedPanel(page);

  await expect(closedContents(page)).toHaveText(["persisted closed note"]);
});
