import { expect, test } from "@playwright/test";

import { openClosedPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("5. Closed 카드의 우클릭 메뉴는 다른 상태 이동과 Delete를 제공하고 삭제한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await page.locator(".dashboard-closed-column .dashboard-card").click({ button: "right" });
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText(["Delete", "Note", "To Do", "Ready", "Doing", "Done"]);
  await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
  const state = await readStoredState(page);
  expect(state.groups[0].tabs.some((tab) => tab.id === "tab-closed-1")).toBe(false);
});
