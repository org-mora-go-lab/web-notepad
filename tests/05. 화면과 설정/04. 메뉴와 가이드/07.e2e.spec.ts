import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openHeaderMenu } from "../../__util__";

test.use({ viewport: MOBILE_VIEWPORT });

test("7. 모바일 가이드는 단축키 안내 없이 10단계를 탐색하고 닫는다", async ({ page }) => {
  await page.goto("/");
  const menu = await openHeaderMenu(page);
  await menu.getByRole("button", { name: "GUIDE", exact: true }).click();
  const guide = page.locator(".user-guide");
  await expect(guide.getByRole("heading", { name: "Write notes", exact: true })).toBeVisible();
  for (let step = 1; step <= 10; step++) {
    await expect(guide.locator(".user-guide-progress")).toHaveText(`${step} / 10`);
    await expect(guide.getByRole("heading", { name: "Keyboard shortcuts", exact: true })).toHaveCount(0);
    await expect(guide.getByRole("button", { name: "SHORTCUT", exact: true })).toHaveCount(0);
    if (step < 10) await guide.locator(".user-guide-next").click();
  }
  await guide.locator(".user-guide-close").click();
  await expect(guide).toHaveCount(0);
});
