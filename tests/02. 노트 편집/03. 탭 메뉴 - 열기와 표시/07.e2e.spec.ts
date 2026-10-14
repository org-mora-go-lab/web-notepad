import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { addTabButton } from "../../__util__";

test.use({ hasTouch: true });

test("7. 모바일 탭 제목을 우클릭해도 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await addTabButton(page).tap();
  await page.locator(".tab-item").first().getByRole("tab").click({ button: "right" });
  await expect(page.getByRole("menu")).toHaveCount(0);
});
