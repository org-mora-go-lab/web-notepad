import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { chooseGroupAction, createGroup, groupActionsButton, groupMenu, groupsCommand } from "../../__util__";

test("6. 그룹 추가·… 버튼과 펼친 고정·수정·삭제 버튼, 이름 수정 저장·취소 버튼은 정사각형으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Alpha");
  const menu = groupMenu(page);

  const expectSquare = async (name: string, size: number) => {
    const bounds = (await menu.getByRole("button", { name, exact: true }).boundingBox())!;
    expect(bounds.width).toBeCloseTo(size, 0);
    expect(bounds.height).toBeCloseTo(size, 0);
  };

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    const itemSize = mobile ? 33.6 : 28;
    await expectSquare("Create group", mobile ? 40.8 : 34);
    await expectSquare("Alpha group actions", itemSize);
    await groupActionsButton(page, "Alpha").click();
    for (const action of ["Pin Alpha group", "Edit Alpha group", "Delete Alpha group"])
      await expectSquare(action, itemSize);

    await menu.getByRole("button", { name: "Edit Alpha group", exact: true }).click();
    await expectSquare("Save group changes", itemSize);
    await expectSquare("Cancel group changes", itemSize);
    await menu.getByRole("button", { name: "Cancel group changes", exact: true }).click();
  }
  await chooseGroupAction(page, "Alpha", "고정");
});
