import { expect, test } from "@playwright/test";

import { chooseGroupAction, createGroup, groupsCommand, groupStatusName, readStoredState } from "../__util__";

test("5. 기본 그룹을 제외한 그룹은 인라인 수정 버튼으로 이름을 편집하고 공백 제거·60자·빈 이름 제한을 적용한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");

  await expect(page.getByRole("button", { name: "Ungrouped 그룹 수정" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Work 그룹 수정", exact: true })).toBeVisible();
  await chooseGroupAction(page, "Work", "수정");
  const nameInput = page.getByRole("textbox", { name: "Work 그룹 이름 수정" });
  await expect(nameInput).toHaveValue("Work");
  await expect(nameInput).toHaveAttribute("maxlength", "60");
  await nameInput.fill("   ");
  await expect(page.getByRole("button", { name: "그룹 수정 저장" })).toBeDisabled();
  await nameInput.press("Enter");
  await expect(groupStatusName(page)).toHaveText("Work");

  await nameInput.fill("B".repeat(70));
  await expect(nameInput).toHaveValue("B".repeat(60));
  await nameInput.fill(" Focus ");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  await expect(groupStatusName(page)).toHaveText("Focus");
  const names = (await readStoredState(page)).groups.map((group) => group.name);
  expect(names).toContain("Focus");
  expect(names).not.toContain(" Focus ");
});
