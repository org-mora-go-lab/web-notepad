import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, paneSlot } from "../__util__";

test("2. 상하 구분선의 10px 드래그 영역 중 8px는 상단 패널 아래에 겹친다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("top note");
  await addTabButton(page).click();
  await page.locator("textarea").fill("bottom note");
  const left = paneSlot(page, "left");
  await dragTabToZone(page, page.locator(".tab-item").last(), left, "Split down");

  const divider = page.locator(".pane-divider.is-horizontal");
  const top = (await page.locator(".pane-slot").first().boundingBox())!;
  const dividerBox = (await divider.boundingBox())!;
  const line = await divider.evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return { height: parseFloat(style.height), bottom: style.bottom };
  });
  expect(dividerBox.height).toBeCloseTo(10, 1);
  expect(line).toEqual({ height: 2, bottom: "0px" });
  expect(dividerBox.y + 8).toBeCloseTo(top.y + top.height, 1);
});
