import { expect, test } from "@playwright/test";

import {
  chooseGroupAction,
  groupsCommand,
  seedSortableGroups,
} from "../../__util__";

test("7. 그룹 이름을 수정한 직후 이름 있는 그룹에 같은 정렬을 적용한다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "수정");
  await page
    .getByRole("textbox", { name: "Edit Zulu group name" })
    .fill("Aardvark");
  await page.getByRole("button", { name: "Save group changes" }).click();

  await expect(page.locator(".group-item .group-select strong")).toHaveText([
    "가방",
    "나무",
    "다람쥐",
    "Aardvark",
    "Alpha",
  ]);
});
