import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("2. Closed 카드의 Reopen 아이콘으로 Todo 탭을 복원한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page.getByRole("button", { name: "Reopen" }).click();
  const state = await readStoredState(page);
  expect(state.closedTabs?.some((entry) => entry.id === "closed-1")).toBe(false);
  expect(state.groups[0].tabs.find((tab) => tab.id === "tab-closed-1")?.tabColor).toBe("gray");
});
