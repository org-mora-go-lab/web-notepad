import { expect, test } from "@playwright/test";

import { openSidebarTools } from "../../__util__";

test("2. 그룹 사이드바 MENU의 SHORTCUT은 단축키 패널을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openSidebarTools(page);
  await tools.getByRole("button", { name: "SHORTCUT" }).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute("aria-hidden", "false");
});
