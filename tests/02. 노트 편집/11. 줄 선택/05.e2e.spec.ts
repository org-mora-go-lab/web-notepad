import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { lineButtons } from "../../__util__";

test("5. 첫 줄 선택 배경은 스크롤 시 상단에 잔상을 남기지 않는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const rail = page.locator(".line-rail");
  const lines = lineButtons(page);
  await editor.fill(Array.from({ length: 80 }, (_, index) => `line ${index + 1}`).join("\n"));

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await editor.evaluate((element) => {
      element.scrollTop = 0;
      element.dispatchEvent(new Event("scroll"));
    });
    await lines.first().click();
    await expect(rail).toHaveCSS("background-attachment", "local");
    await editor.evaluate((element) => {
      element.scrollTop = 330;
      element.dispatchEvent(new Event("scroll"));
    });
    await expect.poll(() => rail.evaluate((element) => element.scrollTop)).toBe(330);
    const bounds = (await rail.boundingBox())!;
    const clip = { x: bounds.x + 2, y: bounds.y + 1, width: 20, height: 8 };
    const selectedTop = await page.screenshot({ clip });
    await lines.first().dispatchEvent("click");
    const unselectedTop = await page.screenshot({ clip });
    expect(selectedTop.equals(unselectedTop)).toBe(true);
  }
});
