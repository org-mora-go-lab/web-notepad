import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("3. 하단 더보기의 GUIDE는 User Guide 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("heading", { name: "User Guide" })).toBeVisible();
  await expect(page.locator(".user-guide-progress")).toHaveText("1 / 11");
});
