import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("6. 그룹 드롭다운의 우측 경계를 드래그해 가로 크기를 조절한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = groupMenu(page);
  const resizer = menu.getByRole("separator", { name: "Resize group panel" });
  const before = (await menu.boundingBox())!;
  const handle = (await resizer.boundingBox())!;

  await page.mouse.move(handle.x + handle.width / 2, handle.y + 40);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2 + 80, handle.y + 40);
  await page.mouse.up();

  const after = (await menu.boundingBox())!;
  expect(after.width).toBeGreaterThan(before.width);
  expect(after.x + after.width).toBeLessThanOrEqual(
    (await page.evaluate(() => window.innerWidth)) - 8,
  );
});
