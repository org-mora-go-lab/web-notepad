import { test } from "@playwright/test";

import {
  createGroup,
  expectSelectedLines,
  groupsCommand,
  lineButtons,
  switchGroup,
} from "../../__util__";

test("8. 그룹을 전환했다 돌아와도 노트별 줄 선택을 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("one\ntwo\nthree");
  const lines = lineButtons(page);
  await lines.nth(1).click();
  await lines.nth(2).click();
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await expectSelectedLines(page, [false]);
  await page.keyboard.press("Escape");
  await switchGroup(page, "Ungrouped");
  await expectSelectedLines(page, [false, true, true]);
});
