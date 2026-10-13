import { expect, test } from "@playwright/test";

import { createGroup, groupMenu, groupsCommand } from "../__util__";

test("23. 그룹 드롭다운은 바깥 클릭·Escape로 닫고 Escape 시 그룹 버튼에 포커스를 복원하며 Ungrouped에는 동작 버튼을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const trigger = groupsCommand(page);
  const menu = groupMenu(page);
  await trigger.click();
  await createGroup(page, "Work");
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("button", { name: /^Ungrouped 그룹 (고정|수정|삭제)/ })).toHaveCount(0);
  await expect(menu.getByRole("button", { name: /^Work 그룹 (고정|수정|삭제)/ })).toHaveCount(3);

  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(menu).toBeVisible();
  await page.locator(".note-area").click();
  await expect(menu).toHaveCount(0);

  await trigger.click();
  await expect(menu).toBeVisible();
  await trigger.click();
  await expect(menu).toHaveCount(0);
});
