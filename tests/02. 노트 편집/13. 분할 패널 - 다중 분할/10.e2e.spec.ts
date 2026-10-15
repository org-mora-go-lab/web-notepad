import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("10. 하단 패널에 새 탭을 추가해도 기존 상하 분할선 위치를 유지한다", async ({ page }) => {
  await seedQuadState(page);
  const column = page.locator('.pane-column[data-column="left"]');
  const bottom = paneSlot(page, "left-bottom");
  const divider = column.getByRole("separator", { name: "Resize pane heights" });
  const columnBox = (await column.boundingBox())!;
  const dividerBox = (await divider.boundingBox())!;
  await page.mouse.move(
    dividerBox.x + dividerBox.width / 2,
    dividerBox.y + dividerBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    dividerBox.x + dividerBox.width / 2,
    columnBox.y + columnBox.height * 0.65,
    { steps: 5 },
  );
  await page.mouse.up();
  const ratio = (await paneSlot(page, "left").boundingBox())!.height / columnBox.height;

  await bottom.getByRole("button", { name: "New tab" }).click();

  await expect(bottom.getByRole("tab")).toHaveCount(2);
  await expect.poll(async () =>
    (await paneSlot(page, "left").boundingBox())!.height / (await column.boundingBox())!.height,
  ).toBeCloseTo(ratio, 2);
});
