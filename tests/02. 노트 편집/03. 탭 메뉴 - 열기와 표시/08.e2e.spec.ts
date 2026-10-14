import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { addTabButton } from "../../__util__";

test.use({ hasTouch: true });

test("8. 모바일 탭 제목을 길게 눌러도 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await addTabButton(page).tap();
  const button = page.locator(".tab-item").first().getByRole("tab");
  await button.dispatchEvent("pointerdown", {
    bubbles: true,
    button: 0,
    buttons: 1,
    pointerId: 1,
    pointerType: "touch",
  });
  await page.waitForTimeout(650);
  await button.dispatchEvent("pointerup", {
    bubbles: true,
    button: 0,
    buttons: 0,
    pointerId: 1,
    pointerType: "touch",
  });
  await expect(page.getByRole("menu")).toHaveCount(0);
});
