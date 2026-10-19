import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, seedStoredStateOnce } from "../../__util__";

test("7. Note와 Doing에서 만든 새 탭은 사용자 색상 순서의 To Do 상태로 생성한다", async ({ page }) => {
  for (const note of [true, false]) {
    await seedStoredStateOnce(page, {
      activeGroupId: "ungrouped",
      groups: [createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("source", "Source task", {
          tabColor: "green",
          dashboardStatus: note ? "icebox" : undefined,
        }),
      ])],
      settings: { tabColorCycle: ["red", "green", "teal"] },
      nextTabNumber: 2,
    });
    await page.getByRole("button", { name: "New tab", exact: true }).click();
    await page.locator("textarea").fill("New task");
    await expect(page.locator('.tab-item[data-tab-color="red"]')).toContainText("New task");
    await openPanel(page, "dashboard-panel");
    await expect(dashboardColumn(page, "todo")).toContainText("New task");
    await expect(page.locator(".dashboard-icebox-column")).toHaveCount(0);
  }
});
