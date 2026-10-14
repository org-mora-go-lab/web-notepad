import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, paneSlot } from "../__util__";

test("1. 상하 구분선의 2px 선은 위아래 패널 사이에 공백 없이 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("top note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("bottom note");
  const left = paneSlot(page, "left");
  await dragTabToZone(page, page.locator(".tab-item").last(), left, "Split down");

  const divider = page.locator(".pane-divider.is-horizontal");
  await expect(divider).toHaveCount(1);
  const slots = page.locator(".pane-slot");
  const top = (await slots.nth(0).boundingBox())!;
  const bottomHeader = (await slots.nth(1).locator(".header").boundingBox())!;
  const dividerBox = (await divider.boundingBox())!;
  const line = await divider.evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { height: parseFloat(style.height), bottom: style.bottom };
  });

  expect(line).toEqual({ height: 2, bottom: "0px" });
  // The line spans from the top pane's bottom edge straight to the bottom pane's tab row.
  expect(dividerBox.y + dividerBox.height - 2).toBeCloseTo(top.y + top.height, 1);
  expect(dividerBox.y + dividerBox.height).toBeCloseTo(bottomHeader.y, 1);
});
