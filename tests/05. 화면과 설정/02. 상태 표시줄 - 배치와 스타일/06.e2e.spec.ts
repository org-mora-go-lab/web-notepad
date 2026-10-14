import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("6. PC와 모바일에서 상태 표시줄 높이와 패딩을 적용한다", async ({ page }) => {
  await page.goto("/");
  const statusBar = page.locator(".footer");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    const height = mobile ? 76.8 : 48;
    await expect(statusBar).toHaveCSS("padding-top", "6px");
    await expect(statusBar).toHaveCSS("padding-right", mobile ? "21px" : "26px");
    await expect(statusBar).toHaveCSS("padding-bottom", "6px");
    await expect(statusBar).toHaveCSS("padding-left", mobile ? "21px" : "16px");
    expect((await statusBar.boundingBox())!.height).toBeCloseTo(height, 1);
    expect((await statusBar.boundingBox())!.y + height).toBeCloseTo(viewport.height, 1);
  }
});
