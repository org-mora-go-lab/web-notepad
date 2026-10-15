import { expect, test } from "@playwright/test";

import { openClosedPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("6. Closed 상태를 Done 오른쪽에 더 짙은 색상의 컬럼으로 표시한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  const done = page.locator('.dashboard-column[data-status="done"]');
  const closed = page.locator(".dashboard-closed-column");
  const [doneBox, closedBox] = await Promise.all([done.boundingBox(), closed.boundingBox()]);
  expect(closedBox!.x).toBeGreaterThan(doneBox!.x);
  await expect(page.locator(".dashboard-board")).toHaveClass(/has-closed/);
  const [doneColor, closedColor] = await Promise.all([
    done.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    closed.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
  ]);
  expect(closedColor.trim()).not.toBe(doneColor.trim());
});
