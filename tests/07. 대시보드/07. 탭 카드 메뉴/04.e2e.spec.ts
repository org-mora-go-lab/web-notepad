import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardColumn } from "../../__util__";

test("4. Todo·Doing·Done 카드 우클릭 메뉴에는 Closed 기능을 표시하지 않는다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-0", "Todo task", { tabColor: "gray" }),
        createTabFixture("tab-1", "Done task", { tabColor: "purple" }),
      ]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "Work task")]),
    ],
    nextTabNumber: 3,
  });
  await openPanel(page, "dashboard-panel");
  await dashboardColumn(page, "todo")
    .locator(".dashboard-card", { hasText: "Todo task" })
    .click({ button: "right" });
  await expect(
    page.getByRole("menu").getByRole("menuitem", { name: "Closed" }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("#dashboard-panel")).toHaveAttribute("aria-hidden", "false");

  await dashboardColumn(page, "done")
    .locator(".dashboard-card", { hasText: "Done task" })
    .click({ button: "right" });

  await expect(
    page.getByRole("menu").getByRole("menuitem", { name: "Closed" }),
  ).toHaveCount(0);
});
