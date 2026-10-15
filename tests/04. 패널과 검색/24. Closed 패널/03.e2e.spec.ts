import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("3. Closed 항목을 닫힌 상태로 유지하며 Todo로 변경한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page
    .locator("#closed-panel")
    .getByRole("button", { name: "Move Archived note to Todo" })
    .click();

  await expect(page.locator("#closed-panel .closed-item")).toHaveCount(1);
  const entry = (await readStoredState(page)).closedTabs?.find(
    (item) => item.id === "closed-1",
  );
  expect(entry?.tab.tabColor).toBe("gray");
});
