import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../../__util__";

test("1. All Group에서도 탭을 드래그해 분할하고 소속 그룹을 유지한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "all-group",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("first", "first")]),
      createGroupFixture("work", "Work", [createTabFixture("second", "second")]),
    ],
  });
  await expect(page.locator(".group-select-name")).toHaveText("All Group");
  const body = page.locator(".body");
  const box = (await body.boundingBox())!;
  await page.locator(".tab-title").filter({ hasText: "second" }).dragTo(body, {
    targetPosition: { x: box.width * 0.75, y: box.height * 0.25 },
  });
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(page.locator('[data-pane="right"] textarea')).toHaveValue("second");
  await page.reload();
  await expect(page.locator('[data-pane="right"] textarea')).toHaveValue("second");
  const groups = await page.evaluate(() => JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups);
  expect(groups.find((group: { id: string }) => group.id === "work").tabs.map((tab: { id: string }) => tab.id)).toEqual(["second"]);
  expect(groups.find((group: { id: string }) => group.id === "work").rightTabIds).toEqual([]);
});
