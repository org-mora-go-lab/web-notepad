import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import {
  groupsCommand,
  readStoredState,
  writeStoredState,
} from "../../__util__";

test("6. 줄을 줄인 노트를 재방문하면 범위 밖 줄 선택만 제거한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "one\ntwo\nthree", { selectedLines: [0, 2] }),
      ]),
    ],
  });
  await page.locator("textarea").fill("one");
  await page.reload();
  await expect(page.locator("textarea")).toHaveValue("one");
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "Ungrouped", exact: true }).click();
  expect((await readStoredState(page)).groups[0].tabs[0].selectedLines).toEqual(
    [0],
  );
});
