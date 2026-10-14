import { expect, test } from "@playwright/test";

import { groupsCommand, readStoredState } from "../../__util__";
import { seedDashboardTabs } from "../../04. 패널과 검색/03. 대시보드/__util__";

test("25. All Group에서도 탭을 수정할 수 있고 변경은 탭이 속한 그룹에 적용되며 새 탭은 Ungrouped에 추가한다", async ({ page }) => {
  await seedDashboardTabs(page);
  await groupsCommand(page).click();
  await page.locator(".group-item").first().getByRole("button", { name: "All Group", exact: true }).click();

  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(4);
  const editor = page.locator("textarea");

  // Edit the Work group's tab from the All Group.
  await tabs.nth(3).getByRole("tab").click();
  await expect(editor).toHaveValue("Work only task");
  await editor.fill("Work only task edited");
  await tabs.nth(3).locator(".dirty-dot").click();

  // A new tab is added to Ungrouped.
  await page.locator(".add-tab").click();
  await expect(tabs).toHaveCount(5);

  const stored = await readStoredState(page);
  const work = stored.groups.find((group) => group.id === "work")!;
  expect(work.tabs[0].content).toBe("Work only task edited");
  expect(work.tabs[0].tabColor).toBe("green");
  const ungrouped = stored.groups.find((group) => group.id === "ungrouped")!;
  expect(ungrouped.tabs).toHaveLength(4);
  expect(ungrouped.tabs[0].content).toBe("Alpha task\nalpha body");

  // Closing a tab in the All Group removes it from its own group.
  await tabs.nth(4).locator(".tab-close").click();
  await page.getByRole("alertdialog", { name: "Close tab" }).getByRole("button", { name: "Close", exact: true }).click();
  await expect(tabs).toHaveCount(5);
  // The Work group keeps a fresh empty tab after its last tab is closed.
  expect((await readStoredState(page)).groups.find((group) => group.id === "work")!.tabs[0].content).toBe("");
});
