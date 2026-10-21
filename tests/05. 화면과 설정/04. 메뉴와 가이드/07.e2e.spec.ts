import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide } from "../../__util__";

test.use({ viewport: MOBILE_VIEWPORT });

test("7. 모바일 가이드는 단축키 안내 없이 10단계를 탐색하고 닫는다", async ({ page }) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(page.locator('button[aria-controls="shortcuts-panel"]:visible')).toHaveCount(0);
  await expect(page.getByRole("button", { name: /SHORTCUT|단축키/ })).toHaveCount(0);
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
