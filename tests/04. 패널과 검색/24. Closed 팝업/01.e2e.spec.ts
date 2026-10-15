import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("1. 그룹 메뉴의 Closed는 현재 그룹의 닫힌 탭 팝업을 연다", async ({ page }) => {
  await seedClosedPanelState(page);
  await groupsCommand(page).click();

  const specialButtons = page.locator("#groups-menu .group-split-row .group-select");
  await expect(specialButtons).toHaveText(["All", "Ungrouped", "Closed"]);
  await specialButtons.filter({ hasText: "Closed" }).click();

  const popup = page.locator("#closed-popup");
  await expect(popup).toHaveAttribute("open", "");
  await expect(popup.locator(".closed-item")).toHaveCount(1);
  await expect(popup).toContainText("Archived note");
  await expect(popup).not.toContainText("Work archive");
});
