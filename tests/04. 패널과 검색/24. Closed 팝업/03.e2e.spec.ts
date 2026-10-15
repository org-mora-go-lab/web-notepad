import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("3. Closed 카드의 영구 삭제 팝업에서 취소하면 항목을 유지한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page.getByRole("button", { name: "Delete closed tab Archived note" }).click();
  const dialog = page.getByRole("alertdialog", { name: "Permanently delete closed tab" });
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator(".dashboard-closed-card")).toHaveCount(1);
  expect((await readStoredState(page)).closedTabs?.some((entry) => entry.id === "closed-1")).toBe(true);
});
