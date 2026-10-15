import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("1. Closed는 현재 그룹 목록과 선택한 탭의 우측 미리보기를 표시한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await groupsCommand(page).click();

  const closedButton = page.locator("#groups-menu .group-closed-item .group-select");
  await expect(closedButton).toHaveText("Closed");
  await closedButton.click();

  const popup = page.locator("#closed-popup");
  await expect(popup).toHaveAttribute("open", "");
  await expect(popup.locator(".closed-item")).toHaveCount(1);
  await expect(popup).toContainText("Archived note");
  await expect(popup).not.toContainText("Work archive");
  await popup.locator(".closed-item-open").click();
  const preview = popup.locator(".closed-preview");
  await expect(preview).toContainText("Archived note");
  await expect(preview).toContainText("Archived body");
  const listBox = (await popup.locator(".closed-results-pane").boundingBox())!;
  expect((await popup.locator(".closed-preview-pane").boundingBox())!.x).toBeGreaterThanOrEqual(
    listBox.x + listBox.width,
  );
});
