import { expect, test } from "@playwright/test";

import { chooseGroupAction, groupsCommand, readStoredState, seedSortableGroups } from "../__util__";

test("22. ⋮ 메뉴의 Pin은 그룹을 목록 맨 위에 고정하고 핀 아이콘을 표시하며 Unpin으로 해제하고 새로고침 후에도 유지한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const names = page.locator(".group-item .group-select strong");
  const zulu = page.locator(".group-item").filter({ hasText: "Zulu" });

  await chooseGroupAction(page, "Zulu", "고정");
  await expect(names).toHaveText(["Zulu", "가방", "나무", "다람쥐", "Alpha", "Ungrouped", "All Group"]);
  await expect(zulu.locator(".group-pin-indicator")).toBeVisible();
  expect((await readStoredState(page)).groups.find((group) => group.id === "zulu")?.pinned).toBe(true);

  // The tab menu's Move Group list follows the same order.
  await page.keyboard.press("Escape");
  await expect(page.locator("#groups-panel")).toHaveAttribute("aria-hidden", "true");
  await page.locator(".tab-item.is-active").click({ button: "right" });
  await page.getByRole("menuitem", { name: "Move Group" }).click();
  await expect(page.locator(".move-group-option")).toHaveText(["Zulu", "가방", "나무", "다람쥐", "Alpha"]);
  await page.keyboard.press("Escape");

  await page.reload();
  await groupsCommand(page).click();
  await expect(names).toHaveText(["Zulu", "가방", "나무", "다람쥐", "Alpha", "Ungrouped", "All Group"]);

  await chooseGroupAction(page, "Zulu", "고정 해제");
  await expect(names).toHaveText(["가방", "나무", "다람쥐", "Alpha", "Zulu", "Ungrouped", "All Group"]);
  await expect(zulu.locator(".group-pin-indicator")).toHaveCount(0);
});
