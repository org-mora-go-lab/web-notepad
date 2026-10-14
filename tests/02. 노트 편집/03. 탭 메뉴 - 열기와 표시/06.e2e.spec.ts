import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { addTabButton } from "../../__util__";

test.use({ hasTouch: true });

test("6. 모바일 탭 제목을 한 번 탭해도 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await addTabButton(page).tap();
  const button = page.locator(".tab-item").first().getByRole("tab");
  await button.tap();
  await expect(button).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("menu")).toHaveCount(0);
});
