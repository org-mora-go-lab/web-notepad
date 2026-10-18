import { expect, test } from "@playwright/test";

import { openHeaderMenu } from "../../__util__";

test("6. 헤더 MENU에서 SETTINGS를 선택하면 메뉴를 닫고 설정을 연다", async ({ page }) => {
  await page.goto("/");
  const tools = await openHeaderMenu(page);
  await tools.getByRole("button", { name: "SETTINGS" }).click();
  await expect(page.locator("#additional-tools-menu")).toHaveCount(0);
  await expect(page.locator("#settings-panel")).toHaveAttribute("aria-hidden", "false");
});
