import { expect, test } from "@playwright/test";

import { createGroup, groupMenu, groupsCommand } from "../../__util__";

test("9. 선택된 그룹 행은 hover한 행보다 배경을 더 짙게 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();
  await createGroup(page, "Work");
  const row = (name: string) => groupMenu(page).locator(".group-item").filter({ hasText: name });
  const background = (name: string) => row(name).evaluate((element) => getComputedStyle(element).backgroundColor);
  // Alpha of a computed rgba()/color() background (opaque when there is none).
  const alpha = (color: string) => Number(color.match(/\/\s*([\d.]+)\)|,\s*([\d.]+)\)$/)?.slice(1).find(Boolean) ?? 1);

  // Work is the active group after creation.
  const active = await background("Work");
  await row("Ungrouped").hover();
  const hovered = await background("Ungrouped");
  expect(hovered).not.toBe(active);
  expect(alpha(hovered)).toBeLessThan(alpha(active));

  // Hovering the selected row keeps its darker background.
  await row("Work").hover();
  expect(await background("Work")).toBe(active);
});
