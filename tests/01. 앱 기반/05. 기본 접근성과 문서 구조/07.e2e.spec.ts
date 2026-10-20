import { expect, test } from "@playwright/test";

test("7. 하단 세 진입점은 각각 이름과 연결 대상을 제공한다", async ({ page }) => {
  await page.goto("/");
  for (const [selector, target] of [
    [".group-select-command", "groups-menu"],
    [".dashboard-command", "dashboard-panel"],
    [".more-command", "footer-more-menu"],
  ]) {
    const button = page.locator(`.footer ${selector}`);
    await expect(button).toHaveAccessibleName(/\S+/);
    await expect(button).toHaveAttribute("aria-controls", target);
  }
});
