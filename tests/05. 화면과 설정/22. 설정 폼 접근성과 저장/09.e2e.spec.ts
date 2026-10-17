import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("9. 패널 위치 변경을 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await page.getByRole("radiogroup", { name: "Panel Position" }).getByRole("radio", { name: "Left", exact: true }).check();
  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-position", "left");
});
