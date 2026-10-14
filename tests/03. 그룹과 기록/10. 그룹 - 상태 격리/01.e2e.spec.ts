import { expect, test } from "@playwright/test";

import { createGroups, switchGroup } from "../../__util__";

test("1. 각 그룹은 서로 다른 탭과 노트 내용을 유지한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("ungrouped note");
  await createGroups(page, "Work");
  await page.locator("textarea").fill("work note");

  await switchGroup(page, "Ungrouped");
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");
  await switchGroup(page, "Work");
  await expect(page.locator("textarea")).toHaveValue("work note");
});
