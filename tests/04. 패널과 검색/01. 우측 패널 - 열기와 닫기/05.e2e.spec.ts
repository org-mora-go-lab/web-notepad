import { expect, test } from "@playwright/test";

import { chooseGroupAction, createGroup, groupsCommand } from "../../__util__";

test("5. 그룹 삭제 확인 팝업이 열린 상태의 Escape는 팝업 취소를 우선하고 그룹 드롭다운을 유지한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#groups-menu");
  await groupsCommand(page).click();
  await createGroup(page, "Archive");

  const popup = page.getByRole("alertdialog", { name: "Delete group" });
  await chooseGroupAction(page, "Archive", "삭제");
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0);
  await expect(panel).toBeVisible();
  await expect(panel.locator(".group-item")).toContainText(["Archive"]);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
});
