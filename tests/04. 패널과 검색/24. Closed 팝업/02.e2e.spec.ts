import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("2. 우측 미리보기 상단의 Reopen 아이콘으로 Todo 탭을 복원한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  const popup = page.locator("#closed-popup");
  await popup.locator(".closed-item-open").click();
  const actions = popup.locator(".closed-preview-actions");
  await expect(actions.getByRole("button")).toHaveCount(2);
  await actions.getByRole("button", { name: "Reopen" }).click();

  await expect(page.getByRole("tab", { name: "Archived note" })).toBeVisible();
  const state = await readStoredState(page);
  expect(state.closedTabs?.some((entry) => entry.id === "closed-1")).toBe(false);
  expect(state.groups[0].tabs.find((tab) => tab.id === "tab-closed-1")?.tabColor).toBe("gray");
});
