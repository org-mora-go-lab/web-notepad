import { expect, test } from "@playwright/test";

import {
  chooseGroupAction,
  createGroup,
  groupsCommand,
  readStoredState,
} from "../../__util__";

test("9. 수정할 그룹 이름은 최대 60자로 입력하고 저장한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await chooseGroupAction(page, "Work", "수정");
  const input = page.getByRole("textbox", { name: "Edit Work group name" });
  await expect(input).toHaveAttribute("maxlength", "60");
  await input.fill("B".repeat(70));
  await expect(input).toHaveValue("B".repeat(60));
  await page.getByRole("button", { name: "Save group changes" }).click();

  expect(
    (await readStoredState(page)).groups.map((group) => group.name),
  ).toContain("B".repeat(60));
});
