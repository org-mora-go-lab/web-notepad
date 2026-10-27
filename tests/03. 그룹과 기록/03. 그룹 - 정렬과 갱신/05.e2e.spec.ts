import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("5. PC에서 그룹 항목을 직접 드래그하면 그룹 순서를 변경한다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const sourceRow = page.locator('[data-group-id="zulu"]');
  await expect(sourceRow.locator("svg.lucide-grip-vertical")).toHaveCount(0);
  const source = (await sourceRow.boundingBox())!;
  const target = (await page
    .locator('[data-group-id="gabang"]')
    .boundingBox())!;
  await page.mouse.move(
    source.x + source.width / 2,
    source.y + source.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(target.x + 40, target.y + target.height / 2, {
    steps: 8,
  });
  await expect(page.locator('[data-group-id="gabang"]')).toHaveClass(
    /is-drop-target/,
  );
  await page.mouse.up();
  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "Zulu",
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
  ]);
  await expect(page.locator("#groups-menu")).toBeVisible();
});
