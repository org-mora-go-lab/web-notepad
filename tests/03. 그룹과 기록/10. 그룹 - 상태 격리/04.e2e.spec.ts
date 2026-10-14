import { expect, test } from "@playwright/test";

import { addTabButton, createGroups, dragDividerBy, readStoredState, switchGroup } from "../../__util__";

test("4. 각 그룹은 분할 비율을 독립적으로 저장하고 다시 전환할 때 복원한다", async ({ page }) => {
  await page.goto("/");
  await addTabButton(page).click();
  await page.locator("textarea").press("Alt+F12");
  await dragDividerBy(page, -120);
  const ungroupedWidth = (await page.locator(".pane-slot").first().boundingBox())!.width;

  await createGroups(page, "Work");
  await addTabButton(page).click();
  await page.locator("textarea").press("Alt+F12");
  await dragDividerBy(page, 120);
  const workWidth = (await page.locator(".pane-slot").first().boundingBox())!.width;
  expect(workWidth).toBeGreaterThan(ungroupedWidth);

  await switchGroup(page, "Ungrouped");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect.poll(async () => (await page.locator(".pane-slot").first().boundingBox())!.width)
    .toBeCloseTo(ungroupedWidth, 0);

  await switchGroup(page, "Work");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect.poll(async () => (await page.locator(".pane-slot").first().boundingBox())!.width)
    .toBeCloseTo(workWidth, 0);

  const groups = (await readStoredState(page)).groups;
  expect(groups.find((group) => group.name === "Ungrouped")!.splitRatio)
    .toBeLessThan(groups.find((group) => group.name === "Work")!.splitRatio);
});
