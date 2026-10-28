import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("2. 북마크 팝업은 Bookmarks 이름의 모달 dialog다", async ({ page }) => {
  await page.goto("/");
  await openBookmarksPanel(page);
  const dialog = page.getByRole("dialog", { name: "Bookmarks" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(await dialog.evaluate((element) => element.matches(":modal"))).toBe(
    true,
  );
});
