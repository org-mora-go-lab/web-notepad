import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("2. Reopen만 제공하고 닫힌 탭을 Todo의 열린 탭으로 복원한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  const panel = page.locator("#closed-panel");
  await expect(panel.locator(".closed-primary-actions button")).toHaveText(["Reopen"]);
  await panel.getByRole("button", { name: "Reopen" }).click();

  await expect(page.getByRole("tab", { name: "Archived note" })).toBeVisible();
  const state = await readStoredState(page);
  expect(state.closedTabs?.some((entry) => entry.id === "closed-1")).toBe(false);
  expect(state.groups[0].tabs.find((tab) => tab.id === "tab-closed-1")?.tabColor).toBe("gray");
});
