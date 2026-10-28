import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("4. 검색 팝업을 열어도 입력창에 자동 포커스하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.locator(".group-select-command").click();
    await page.locator(".more-command").click();
    await page.getByRole("button", { name: "SEARCH", exact: true }).click();
    const search = page.getByRole("searchbox", { name: "Search everything" });
    await expect(search).toBeVisible();
    await expect(search).not.toBeFocused();
    await search.click();
    await expect(search).toBeFocused();
    await page.keyboard.press("Escape");
  }
});
