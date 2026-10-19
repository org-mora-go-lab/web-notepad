import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("3. 하단 더보기의 GUIDE는 User Guide 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("heading", { name: "User Guide" })).toBeVisible();
  await expect(page.locator(".user-guide-progress")).toHaveText("1 / 11");
});
