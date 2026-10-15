import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("4. Closed 항목의 영구 삭제를 확정하면 저장 데이터에서 제거한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page.locator("#closed-popup .closed-item-open").click();
  await page.getByRole("button", { name: "Delete closed tab Archived note" }).click();
  await page
    .getByRole("alertdialog", { name: "Permanently delete closed tab" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();

  await expect(page.locator("#closed-popup .closed-item")).toHaveCount(0);
  expect(
    (await readStoredState(page)).closedTabs?.some(
      (entry) => entry.id === "closed-1",
    ),
  ).toBe(false);
});
