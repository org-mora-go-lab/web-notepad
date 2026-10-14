import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS, MOBILE_VIEWPORT } from "../../__constant__";
import { chooseGroupAction, createGroup, expectCssPx, groupMenu, groupsCommand } from "../../__util__";

test("7. 그룹 드롭다운의 그룹 이름과 입력란의 글자 크기·높이를 표시하고 모바일은 1.2배로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const menu = groupMenu(page);
  const createInput = menu.locator('input[aria-label="New group name"]');
  await createGroup(page, "Alpha");

  await chooseGroupAction(page, "Alpha", "수정");
  const editInput = menu.locator('input[aria-label="Edit Alpha group name"]');
  await expect(editInput).toHaveCSS("font-size", "15px");
  await expect(editInput).toHaveCSS("height", "30px");
  await editInput.press("Escape");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    await expect(createInput).toHaveCSS("font-size", mobile ? "16.8px" : "14px");
    await expectCssPx(createInput, "height", mobile ? 40.8 : 34);
    await expect(menu.locator('.group-item:has-text("Alpha") strong')).toHaveCSS("font-size", mobile ? "18px" : "15px");
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  await chooseGroupAction(page, "Alpha", "수정");
  await expect(editInput).toHaveCSS("font-size", "18px");
  await expectCssPx(editInput, "height", 36);
  await editInput.press("Escape");
});
