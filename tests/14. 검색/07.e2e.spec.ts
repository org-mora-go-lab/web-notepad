import { expect, test } from "@playwright/test";

import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("7. MENU의 CLOSED 바로 아래 전체 검색 명령을 선택하면 우측 검색 패널을 열고 하단 메뉴에는 표시하지 않는다", async ({ page }) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await expect(page.locator(".footer .global-search-command")).toHaveCount(0);

  await page.getByRole("button", { name: "MENU", exact: true }).click();
  const items = page.locator(".additional-tools-menu > [role=\"menuitem\"]:visible");
  const classes = await items.evaluateAll((elements) => elements.map((element) => element.className));
  const closedIndex = classes.findIndex((name) => name.includes("closed-command"));
  expect(classes[closedIndex + 1]).toContain("global-search-command");
  const closedBounds = (await items.nth(closedIndex).boundingBox())!;
  const searchBounds = (await items.nth(closedIndex + 1).boundingBox())!;
  expect(searchBounds.y).toBeGreaterThanOrEqual(closedBounds.y + closedBounds.height - 1);
  await page.keyboard.press("Escape");

  await openGlobalSearchPanel(page);
  await expect(page.locator("#global-search-panel")).toHaveAttribute("aria-hidden", "false");
});
