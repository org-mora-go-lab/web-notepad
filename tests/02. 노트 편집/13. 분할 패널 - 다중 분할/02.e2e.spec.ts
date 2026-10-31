import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("2. 상하 구분선으로 높이 비율을 조정하고 20%~80%로 제한한다", async ({
  page,
}) => {
  await seedQuadState(page, 0.3);
  const column = page.locator('.pane-column[data-column="left"]');
  const top = paneSlot(page, "left");
  const divider = column.getByRole("separator", {
    name: "Resize pane heights",
  });
  const topRatio = async () => {
    const columnBox = (await column.boundingBox())!;
    return (await top.boundingBox())!.height / columnBox.height;
  };
  const dragTo = async (ratio: number) => {
    await divider.hover();
    const columnBox = (await column.boundingBox())!;
    const box = (await divider.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2,
      columnBox.y + columnBox.height * ratio,
      { steps: 5 },
    );
    await page.mouse.up();
  };

  await expect(divider).toHaveAttribute("aria-orientation", "horizontal");
  expect(await topRatio()).toBeCloseTo(0.5, 1);

  await dragTo(0.65);
  await expect.poll(topRatio).toBeCloseTo(0.65, 1);
  await dragTo(0.05);
  await expect.poll(topRatio).toBeCloseTo(0.2, 2);
  await dragTo(0.97);
  await expect.poll(topRatio).toBeCloseTo(0.8, 2);
});
