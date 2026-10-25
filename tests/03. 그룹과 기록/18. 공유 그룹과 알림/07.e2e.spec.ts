import { expect, test } from "@playwright/test";

import { moreCommand, openMoreMenu } from "../../__util__";

test("7. 그룹알림은 더보기에서 열고 Escape로 닫으면 더보기로 포커스를 돌려준다", async ({ page }) => {
  await page.goto("/");
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".notification-command")).toHaveCount(0);
    const menu = await openMoreMenu(page);
    await menu.getByRole("button", { name: "Group notifications", exact: true }).click();
    await expect(menu).toHaveCount(0);
    const panel = page.getByRole("dialog", { name: "Group notifications", exact: true });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("No shared group updates yet.");
    const bounds = (await panel.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(moreCommand(page)).toBeFocused();
  }
});
