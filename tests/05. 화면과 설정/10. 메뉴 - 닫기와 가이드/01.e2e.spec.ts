import { expect, test } from "@playwright/test";

import { openSidebarTools } from "../../__util__";

test("1. 사이드바 MENU에서 SETTINGS를 선택하면 사이드바를 닫고 설정을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openSidebarTools(page);
  await tools.getByRole("button", { name: "SETTINGS" }).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
});
