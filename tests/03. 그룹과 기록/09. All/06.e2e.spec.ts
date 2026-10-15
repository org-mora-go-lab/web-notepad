import { expect, test } from "@playwright/test";

import { groupsCommand, readStoredState } from "../../__util__";
import { seedDashboardTabs } from "../../04. 패널과 검색/__util__";

test("6. All에서 만든 새 탭은 Ungrouped에 추가한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await groupsCommand(page).click();
  const before = (await readStoredState(page)).groups.find((group) => group.id === "ungrouped")!.tabs.length;

  await page.locator(".add-tab").click();

  const ungrouped = (await readStoredState(page)).groups.find((group) => group.id === "ungrouped")!;
  expect(ungrouped.tabs).toHaveLength(before + 1);
  expect(ungrouped.tabs.at(-1)?.content).toBe("");
});
