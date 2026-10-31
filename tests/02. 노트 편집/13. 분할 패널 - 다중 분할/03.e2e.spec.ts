import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("3. 왼쪽과 오른쪽 열의 상하 분할 비율을 독립적으로 관리한다", async ({
  page,
}) => {
  await seedQuadState(page);
  const leftColumn = page.locator('.pane-column[data-column="left"]');
  const rightColumn = page.locator('.pane-column[data-column="right"]');
  const divider = leftColumn.getByRole("separator", {
    name: "Resize pane heights",
  });
  const columnBox = (await leftColumn.boundingBox())!;
  const dividerBox = (await divider.boundingBox())!;
  const point = {
    x: dividerBox.x + dividerBox.width / 2,
    startY: dividerBox.y + dividerBox.height / 2,
    endY: columnBox.y + columnBox.height * 0.65,
  };
  await divider.evaluate((element, position) => {
    element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        clientX: position.x,
        clientY: position.startY,
      }),
    );
  }, point);
  await page.evaluate((position) => {
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: position.x,
        clientY: position.endY,
      }),
    );
    window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  }, point);

  await expect
    .poll(async () => {
      return (
        (await paneSlot(page, "left").boundingBox())!.height /
        (await leftColumn.boundingBox())!.height
      );
    })
    .toBeCloseTo(0.65, 1);
  const rightRatio =
    (await paneSlot(page, "right").boundingBox())!.height /
    (await rightColumn.boundingBox())!.height;
  expect(rightRatio).toBeCloseTo(0.5, 1);
});
