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

  const leftRatio =
    (await paneSlot(page, "left").boundingBox())!.height /
    (await leftColumn.boundingBox())!.height;
  const rightRatio =
    (await paneSlot(page, "right").boundingBox())!.height /
    (await rightColumn.boundingBox())!.height;
  expect(leftRatio).toBeCloseTo(0.65, 1);
  expect(rightRatio).toBeCloseTo(0.5, 1);
});
