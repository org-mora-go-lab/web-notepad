import { expect, test } from "@playwright/test";

import { groupMenu, groupsCommand } from "../../__util__";

test("4. All Group과 Ungrouped 아래에 이름 입력란과 + 버튼을 한 줄로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const menu = groupMenu(page);
  const ungrouped = menu.locator(".group-item").filter({ hasText: "Ungrouped" });
  const form = menu.locator(".group-create-form");
  const input = page.getByRole("textbox", { name: "New group name" });
  const button = page.getByRole("button", { name: "Create group" });
  const [ungroupedBox, formBox, inputBox, buttonBox] = await Promise.all([
    ungrouped.boundingBox(),
    form.boundingBox(),
    input.boundingBox(),
    button.boundingBox(),
  ]);

  expect(formBox!.y).toBeGreaterThanOrEqual(ungroupedBox!.y + ungroupedBox!.height);
  expect(Math.abs(inputBox!.y - buttonBox!.y)).toBeLessThan(2);
  expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(buttonBox!.x);
  await expect(form).toBeVisible();
});
