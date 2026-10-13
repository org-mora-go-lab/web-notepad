import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { chooseGroupAction, createGroup, groupMenu, groupsCommand } from "../__util__";

test("8. 그룹 추가·인라인 고정·수정·삭제 버튼과 이름 수정 저장·취소 버튼은 정사각형으로 표시한다", async ({ page }) => {
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
    await expectSquare("그룹 생성", mobile ? 40.8 : 34);
    for (const action of ["고정", "수정", "삭제"]) await expectSquare(`Alpha 그룹 ${action}`, itemSize);

    await chooseGroupAction(page, "Alpha", "수정");
    await expectSquare("그룹 수정 저장", itemSize);
    await expectSquare("그룹 수정 취소", itemSize);
    await menu.getByRole("button", { name: "그룹 수정 취소", exact: true }).click();
  }
});
