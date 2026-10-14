import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("7. Panel Position을 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  await panel.getByRole("radio", { name: "Left", exact: true }).check();
  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-position", "left");
  await expect(panel.getByRole("radio", { name: "Left", exact: true })).toBeChecked();
});
