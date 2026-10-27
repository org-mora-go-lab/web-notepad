import { expect, test } from "@playwright/test";

import { openPanel, readStoredState } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../../__util__";

test("5. 대시보드 카드 드래그가 아닌 외부 데이터는 강조하거나 상태를 변경하지 않는다", async ({
  page,
}) => {
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const before = await readStoredState(page);
  const dataTransfer = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.setData("text/plain", "tab-1");
    return transfer;
  });
  const target = dashboardColumn(page, "done");
  await target.dispatchEvent("dragover", { dataTransfer });
  await expect(target).not.toHaveClass(/is-drop-target/);
  await target.dispatchEvent("drop", { dataTransfer });
  expect(await readStoredState(page)).toEqual(before);
  await expect(dashboardColumn(page, "todo")).toContainText("Alpha task");
});
