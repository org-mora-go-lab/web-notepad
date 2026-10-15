import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("2. Closed 항목을 원래 그룹의 열린 탭으로 복원한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page.locator("#closed-panel").getByRole("button", { name: "Restore" }).click();

  await expect(page.getByRole("tab", { name: "Archived note" })).toBeVisible();
  const state = await readStoredState(page);
  expect(state.closedTabs?.some((entry) => entry.id === "closed-1")).toBe(false);
});
