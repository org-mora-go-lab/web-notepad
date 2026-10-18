import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("9. 패널을 닫으면 해당 패널을 다시 inert 상태로 전환한다", async ({ page }) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  const panel = page.locator("#bookmarks-panel");
  await panel.getByRole("button", { name: "Close Bookmarks" }).click();
  await expect(panel).toHaveAttribute("inert", "");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
