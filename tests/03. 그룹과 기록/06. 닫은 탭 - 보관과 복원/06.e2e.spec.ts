import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createGroupFixture, createTabFixture } from "../../__fixture__";
import { groupStatusName, openClosedPanel, seedStoredStateOnLoad, switchGroup } from "../../__util__";

test("6. MENU의 CLOSED는 모든 그룹의 닫은 탭과 전체 개수를 표시한다", async ({ page }) => {
  const workGroup = createGroupFixture("work", "Work", [createTabFixture("work-tab", "Work note")]);
  const personalGroup = createGroupFixture("personal", "Personal", [
    createTabFixture("personal-tab", "Personal note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: workGroup.id,
    groups: [workGroup, personalGroup],
    nextTabNumber: 3,
    closedTabs: [
      createClosedTabFixture("work-closed-1", workGroup.id, createTabFixture("work-closed-tab-1", "Work archive 1")),
      createClosedTabFixture("work-closed-2", workGroup.id, createTabFixture("work-closed-tab-2", "Work archive 2")),
      createClosedTabFixture("personal-closed", personalGroup.id, createTabFixture("personal-closed-tab", "Personal archive")),
    ],
  });

  const closedCount = page.locator(".closed-command .closed-count");
  await expect(groupStatusName(page)).toHaveText("Work");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(closedCount).toHaveText("3");
  await page.keyboard.press("Escape");
  await openClosedPanel(page);
  await expect(page.locator(".closed-item")).toHaveCount(3);
  await expect(page.locator(".closed-item")).toContainText(["Work archive 1", "Work archive 2", "Personal archive"]);
  await page.keyboard.press("Escape");

  await switchGroup(page, "Personal");
  await expect(groupStatusName(page)).toHaveText("Personal");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(closedCount).toHaveText("3");
  await page.keyboard.press("Escape");
  await openClosedPanel(page);
  await expect(page.locator(".closed-item")).toHaveCount(3);
});
