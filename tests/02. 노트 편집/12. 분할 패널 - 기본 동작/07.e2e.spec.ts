import { expect, test } from "@playwright/test";

import { dividerDistanceFromCenter, dragDividerBy } from "../../__util__";
import { seedSplitState } from "../__util__";

test("7. 오른쪽 패널에 새 탭을 추가해도 기존 좌우 분할선 위치를 유지한다", async ({ page }) => {
  await seedSplitState(page);
  const rightPane = page.locator(".pane-slot").nth(1);

  await dragDividerBy(page, 70);
  await expect.poll(() => dividerDistanceFromCenter(page)).toBeGreaterThan(50);
  const distance = await dividerDistanceFromCenter(page);

  await rightPane.getByRole("button", { name: "New tab" }).click();
  await expect(rightPane.getByRole("tab")).toHaveCount(2);
  await expect.poll(() => dividerDistanceFromCenter(page)).toBeCloseTo(distance, 0);
});
