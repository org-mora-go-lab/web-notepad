import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("1. 그룹 메뉴의 Closed는 현재 그룹의 닫힌 탭 패널을 연다", async ({ page }) => {
  await seedClosedPanelState(page);
  await groupsCommand(page).click();

  const specialButtons = page.locator("#groups-menu .group-split-row .group-select");
  await expect(specialButtons).toHaveText(["All", "Ungrouped", "Closed"]);
  await specialButtons.filter({ hasText: "Closed" }).click();

  const panel = page.locator("#closed-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel.locator(".closed-item")).toHaveCount(1);
  await expect(panel).toContainText("Archived note");
  await expect(panel).not.toContainText("Work archive");
});
