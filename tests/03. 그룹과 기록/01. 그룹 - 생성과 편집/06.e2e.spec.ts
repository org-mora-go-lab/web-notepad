import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("6. 그룹 사이드바의 우측 구분선을 드래그해 작업공간과 너비를 조절한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = groupMenu(page);
  const resizer = menu.getByRole("separator", { name: "Resize group panel" });
  const before = (await menu.boundingBox())!;
  const workspaceBefore = (await page.locator(".workspace").boundingBox())!;
  const handle = (await resizer.boundingBox())!;

  await page.mouse.move(handle.x + handle.width / 2, handle.y + 40);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2 + 80, handle.y + 40);
  await page.mouse.up();

  const after = (await menu.boundingBox())!;
  expect(after.width).toBeGreaterThan(before.width);
  const workspaceAfter = (await page.locator(".workspace").boundingBox())!;
  expect(workspaceAfter.x).toBeCloseTo(after.width, 0);
  expect(workspaceAfter.width).toBeLessThan(workspaceBefore.width);
});
