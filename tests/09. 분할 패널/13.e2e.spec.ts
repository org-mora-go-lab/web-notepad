import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "./__util__";

test("13. 상하 구분선으로 높이 비율을 20%~80% 범위에서 조정하고 재접속 시 중앙으로 초기화한다", async ({ page }) => {
  await seedQuadState(page, 0.3);
  const column = page.locator('.pane-column[data-column="left"]');
  const top = paneSlot(page, "left");
  const divider = column.getByRole("separator", { name: "상하 크기 조절" });
  const topRatio = async () => {
    const columnBox = (await column.boundingBox())!;
    return (await top.boundingBox())!.height / columnBox.height;
  };
  const dragTo = async (ratio: number) => {
    const columnBox = (await column.boundingBox())!;
    const box = (await divider.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, columnBox.y + columnBox.height * ratio, { steps: 5 });
    await page.mouse.up();
  };

  await expect(divider).toHaveAttribute("aria-orientation", "horizontal");
  expect(await topRatio()).toBeCloseTo(0.5, 1);

  await dragTo(0.65);
  expect(await topRatio()).toBeCloseTo(0.65, 1);
  await dragTo(0.05);
  expect(await topRatio()).toBeCloseTo(0.2, 2);
  await dragTo(0.97);
  expect(await topRatio()).toBeCloseTo(0.8, 2);

  const rightTop = paneSlot(page, "right");
  const rightColumn = page.locator('.pane-column[data-column="right"]');
  expect((await rightTop.boundingBox())!.height / (await rightColumn.boundingBox())!.height).toBeCloseTo(0.5, 1);

  await page.reload();
  await expect(top).toBeVisible();
  expect(await topRatio()).toBeCloseTo(0.5, 1);
});
