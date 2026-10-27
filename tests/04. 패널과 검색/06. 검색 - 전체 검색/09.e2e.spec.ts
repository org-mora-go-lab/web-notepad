import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { bookmarkActiveTab, openGlobalSearchPanel } from "../../__util__";

test("9. 검색 팝오버는 입력·결과·미리보기·초기화에서도 콘텐츠 높이를 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "Constant height bookmark");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openGlobalSearchPanel(page);
    const popup = page.locator("#global-search-popup"),
      body = popup.locator(".global-search-body");
    const height = (await body.boundingBox())!.height;
    const input = popup.getByRole("searchbox");
    await input.fill("Constant height");
    await popup.locator(".global-search-result").first().waitFor();
    await expect
      .poll(async () => (await body.boundingBox())!.height)
      .toBeCloseTo(height, 0);
    await popup.locator(".global-search-result").first().click();
    await expect(popup).toHaveClass(/has-preview/);
    expect((await body.boundingBox())!.height).toBeCloseTo(height, 0);
    await input.fill("No matching entry xyz");
    await expect(popup).toContainText("No search results");
    expect((await body.boundingBox())!.height).toBeCloseTo(height, 0);
    await input.fill("");
    await expect(popup).toContainText("Enter a search term");
    expect((await body.boundingBox())!.height).toBeCloseTo(height, 0);
    await page.keyboard.press("Escape");
  }
});
