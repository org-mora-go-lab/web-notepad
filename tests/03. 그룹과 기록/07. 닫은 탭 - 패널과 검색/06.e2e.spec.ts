import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, closedContents, openClosedPanel } from "../../__util__";

test("6. 닫은 탭을 삭제해도 Closed 패널은 열린 상태로 유지하고 다른 항목은 그대로 둔다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "keep this note");
  await closeActiveTabWithContent(page, "delete this note");
  await openClosedPanel(page);
  await expect(closedContents(page)).toHaveText(["delete this note", "keep this note"]);

  await page.locator(".closed-item").first().locator(".remove-closed").click();
  await expect(closedContents(page)).toHaveText("keep this note");
  await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
});
