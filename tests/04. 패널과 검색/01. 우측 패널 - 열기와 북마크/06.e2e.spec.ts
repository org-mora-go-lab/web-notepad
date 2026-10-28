path_helper: node.save: Permission denied
import { expect, type Locator, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import {
  groupsCommand,
  openBookmarksPanel,
  openSystemGroupMenu,
} from "../../__util__";

async function expectIconCentered(button: Locator, withoutPadding = false) {
  if (withoutPadding) {
    await expect(button).toHaveCSS("padding-left", "0px");
    await expect(button).toHaveCSS("padding-right", "0px");
  }
  const buttonBox = (await button.boundingBox())!;
  const iconBox = (await button
    .locator(":scope > svg:only-child")
    .boundingBox())!;

  expect(buttonBox.width).toBeGreaterThanOrEqual(44);
  expect(buttonBox.height).toBeGreaterThanOrEqual(44);
  expect(iconBox.x + iconBox.width / 2).toBeCloseTo(
    buttonBox.x + buttonBox.width / 2,
    1,
  );
  expect(iconBox.y + iconBox.height / 2).toBeCloseTo(
    buttonBox.y + buttonBox.height / 2,
    1,
  );
}

test("6. 모바일 아이콘 전용 버튼의 아이콘을 가로·세로 정중앙에 배치한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  await openBookmarksPanel(page);
  await expectIconCentered(
    page.locator("#bookmarks-panel .corner-popover-close"),
  );
  await page.locator("#bookmarks-panel .corner-popover-close").click();

  await groupsCommand(page).click();
  await openSystemGroupMenu(page);
  const createInput = page.getByRole("textbox", { name: "New group name" });
  await createInput.fill("Work");
  await expectIconCentered(
    page.getByRole("button", { name: "Create group" }),
    true,
  );
  await page.getByRole("button", { name: "Create group" }).click();
  await page.getByRole("button", { name: "Work group actions" }).click();
  const deleteAction = page.getByRole("button", { name: "Delete Work group" });
  await expect(deleteAction).toBeVisible();
  expect((await deleteAction.boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
