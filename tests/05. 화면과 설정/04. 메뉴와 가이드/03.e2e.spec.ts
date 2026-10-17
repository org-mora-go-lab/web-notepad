import { expect, test } from "@playwright/test";

import { openSidebarTools } from "../../__util__";

test("3. 그룹 사이드바 MENU의 GUIDE는 User Guide 팝업을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openSidebarTools(page);
  await tools.getByRole("button", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("heading", { name: "User Guide" })).toBeVisible();
});
