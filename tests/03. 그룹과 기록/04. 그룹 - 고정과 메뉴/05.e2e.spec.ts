import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { groupsCommand, seedSortableGroups } from "../../__util__";

test.use({ viewport: MOBILE_VIEWPORT, hasTouch: true, isMobile: true });

test("5. 모바일에서 그룹 항목을 직접 터치해 끌어 순서를 변경한다", async ({ page }) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  const source = (await page.locator('[data-group-id="zulu"]').boundingBox())!;
  const target = (await page.locator('[data-group-id="gabang"]').boundingBox())!;
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: source.x + source.width / 2, y: source.y + source.height / 2 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: target.x + 40, y: target.y + target.height / 2 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator(".group-item .group-select strong")).toHaveText(["Zulu", "가방", "나무", "다람쥐", "Alpha"]);
  await expect(page.locator("#groups-menu")).toBeVisible();
  await session.detach();
});
