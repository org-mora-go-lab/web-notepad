import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("1. MENU 버튼은 탭 줄 우측 상단에서 탭 목록과 겹치지 않게 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(trigger).toBeInViewport();
    const bounds = (await trigger.boundingBox())!;
    expect(bounds.y).toBe(0);
    expect(bounds.x + bounds.width).toBeCloseTo(viewport.width, 1);
    const tabsBounds = (await page.locator(".tabs-scroll").first().boundingBox())!;
    expect(tabsBounds.x + tabsBounds.width).toBeLessThanOrEqual(bounds.x + 1);
    await expect(trigger.locator("svg")).toBeVisible();
    await expect(trigger.locator("svg")).toHaveClass(/lucide-menu/);
  }
});
