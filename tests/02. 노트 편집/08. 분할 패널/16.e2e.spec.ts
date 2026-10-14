import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, paneSlot } from "./__util__";

test("16. 상하 구분선은 2px 선을 상단 패널과 하단 패널의 탭 줄에 공백 없이 붙여 표시하고 드래그 영역은 10px다", async ({ page }) => {
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

  expect(dividerBox.height).toBeCloseTo(10, 1);
  expect(line).toEqual({ height: 2, bottom: "0px" });
  // The line spans from the top pane's bottom edge straight to the bottom pane's tab row.
  expect(dividerBox.y + dividerBox.height - 2).toBeCloseTo(top.y + top.height, 1);
  expect(dividerBox.y + dividerBox.height).toBeCloseTo(bottomHeader.y, 1);
});
