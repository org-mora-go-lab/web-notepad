import { expect, test } from "@playwright/test";

import { toggleDashboardStatus } from "../../__util__";
import { openClosedPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("6. Icebox와 Closed 상태를 양쪽에 구분되는 색상의 컬럼으로 표시한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  await toggleDashboardStatus(page, "icebox");
  const icebox = page.locator(".dashboard-icebox-column");
  const todo = page.locator('.dashboard-column[data-status="todo"]');
  const done = page.locator('.dashboard-column[data-status="done"]');
  const closed = page.locator(".dashboard-closed-column");
  const [iceboxBox, todoBox, doneBox, closedBox] = await Promise.all([
    icebox.boundingBox(),
    todo.boundingBox(),
    done.boundingBox(),
    closed.boundingBox(),
  ]);
  expect(iceboxBox!.x).toBeLessThan(todoBox!.x);
  expect(closedBox!.x).toBeGreaterThan(doneBox!.x);
  await expect(page.locator(".dashboard-board")).toHaveClass(/has-icebox.*has-closed/);
  await expect(
    page.locator(".dashboard-statuses > h3 .dashboard-status-label"),
  ).toHaveText(["Note", "To do", "Doing", "Done", "Closed"]);
  const [iceboxColor, todoColor, doneColor, closedColor] = await Promise.all([
    icebox.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    todo.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    done.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    closed.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
  ]);
  expect(iceboxColor.trim()).toBe("#666");
  expect(todoColor.trim()).toBe("#b8b8b0");
  expect(doneColor.trim()).toBe("#c3a6f5");
  expect(closedColor.trim()).toBe("#286044");
});
