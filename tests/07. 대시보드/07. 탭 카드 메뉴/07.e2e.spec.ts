import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import {
  authenticateBrowser,
  openPanel,
  seedDashboardTabs,
} from "../../__util__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("7. 모바일 탭 카드 메뉴 글자를 계정 드롭다운과 같은 크기로 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await seedDashboardTabs(page);
  const account = page.locator("button.auth-command:not(.is-loading)");
  await expect(account).toBeVisible();
  await account.tap();
  const accountFontSize = await page
    .locator(".auth-menu [role='menuitem']")
    .first()
    .evaluate((element) => getComputedStyle(element).fontSize);
  await page.keyboard.press("Escape");

  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-card-open").first().dblclick();
  const cardMenuItem = page
    .getByRole("menu", { name: "Tab actions" })
    .getByRole("menuitem")
    .first();
  await expect(cardMenuItem).toBeVisible();
  await expect(cardMenuItem).toHaveCSS("font-size", accountFontSize);
});
