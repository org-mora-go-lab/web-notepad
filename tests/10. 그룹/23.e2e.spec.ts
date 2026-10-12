import { expect, test } from "@playwright/test";

import { createGroup, groupMenuButton, groupsCommand } from "../__util__";

test("23. ⋮ 메뉴는 바깥 클릭·Escape로 닫고 방향키로 탐색하며 Escape 시 ⋮ 버튼에 포커스를 복원하고 Ungrouped에는 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  await expect(groupMenuButton(page, "Ungrouped")).toHaveCount(0);

  const trigger = groupMenuButton(page, "Work");
  const menu = page.getByRole("menu", { name: "Work 그룹 메뉴" });
  const items = menu.getByRole("menuitem");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(items.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(2)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(items.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(items.nth(2)).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "false");

  await trigger.click();
  await expect(menu).toBeVisible();
  await page.locator("#groups-panel h2").click();
  await expect(menu).toHaveCount(0);

  await trigger.click();
  await expect(menu).toBeVisible();
  await trigger.click();
  await expect(menu).toHaveCount(0);
});
