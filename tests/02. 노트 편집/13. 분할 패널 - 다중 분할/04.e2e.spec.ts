import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("4. 상하 분할 비율은 앱 재접속 시 중앙으로 초기화한다", async ({ page }) => {
  await seedQuadState(page);
  const column = page.locator('.pane-column[data-column="left"]');
  const divider = column.getByRole("separator", { name: "Resize pane heights" });
  const columnBox = (await column.boundingBox())!;
  const dividerBox = (await divider.boundingBox())!;
  await page.mouse.move(dividerBox.x + dividerBox.width / 2, dividerBox.y + dividerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(dividerBox.x + dividerBox.width / 2, columnBox.y + columnBox.height * 0.65, { steps: 5 });
  await page.mouse.up();
  await page.reload();

  const ratio = (await paneSlot(page, "left").boundingBox())!.height / (await column.boundingBox())!.height;
  expect(ratio).toBeCloseTo(0.5, 1);
});
