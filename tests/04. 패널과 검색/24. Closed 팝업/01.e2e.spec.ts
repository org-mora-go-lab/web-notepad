import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("1. Closed 명령으로 대시보드의 Closed 상태를 표시하고 숨긴다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openPanel(page, "dashboard-panel");
  const command = page.locator(".dashboard-closed-command");
  await expect(command).toHaveAttribute("aria-pressed", "false");
  await command.click();
  await expect(command).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".dashboard-closed-card")).toContainText("Archived note");
  await expect(page.locator("#closed-popup")).toHaveCount(0);
  await command.click();
  await expect(page.locator(".dashboard-closed-column")).toHaveCount(0);
});
