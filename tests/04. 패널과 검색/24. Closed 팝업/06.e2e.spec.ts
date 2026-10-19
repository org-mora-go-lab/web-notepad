import { expect, test } from "@playwright/test";

import { openClosedPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("6. Icebox와 Closed 상태를 양쪽에 구분되는 색상의 컬럼으로 표시한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openClosedPanel(page);
  const icebox = page.locator(".dashboard-icebox-column");
  const todo = page.locator('.dashboard-column[data-status="todo"]');
  const doing = page.locator('.dashboard-column[data-status="in-progress"]');
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
  ).toHaveText(["Note", "To Do", "Doing", "Done", "Closed"]);
  const [iceboxColor, todoColor, doingColor, doneColor, closedColor] = await Promise.all([
    icebox.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    todo.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    doing.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    done.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
    closed.evaluate((element) => getComputedStyle(element).getPropertyValue("--dashboard-accent")),
  ]);
  expect(iceboxColor.trim()).toBe("#666");
  expect(todoColor.trim()).toBe("#b8b8b0");
  expect(doingColor.trim()).toBe("#a5b4fc");
  expect(doneColor.trim()).toBe("#7fd8d0");
  expect(closedColor.trim()).toBe("#8fe3b0");
});
