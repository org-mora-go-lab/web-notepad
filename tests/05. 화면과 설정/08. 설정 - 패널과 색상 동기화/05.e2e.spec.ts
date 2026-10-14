import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("5. Panel Slide 선택을 저장하고 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const on = panel.getByRole("radio", { name: "On", exact: true });
  await on.check();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings.panelSlide, STORAGE_KEY))
    .toBe(true);

  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "on");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(on).toBeChecked();
});
