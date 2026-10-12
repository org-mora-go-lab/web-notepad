import { expect, test } from "@playwright/test";

import { createGroup, groupMenuButton, groupsCommand, groupStatusName, readStoredState } from "../__util__";

test("5. 기본 그룹을 제외한 그룹은 ⋮ 메뉴의 Edit·Delete·Pin 중 Edit로 이름을 편집하고 공백 제거·60자·빈 이름 제한을 적용한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");

  await expect(groupMenuButton(page, "Ungrouped")).toHaveCount(0);
  await groupMenuButton(page, "Work").click();
  const menu = page.getByRole("menu", { name: "Work 그룹 메뉴" });
  await expect(menu.getByRole("menuitem")).toHaveText(["Edit", "Delete", "Pin"]);
  await menu.getByRole("menuitem", { name: "Work 그룹 수정" }).click();
  await expect(menu).toHaveCount(0);
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
