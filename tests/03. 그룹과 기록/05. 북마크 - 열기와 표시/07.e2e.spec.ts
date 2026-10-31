import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { seedBookmarkContentItems } from "./__fixture__";

test.use({ hasTouch: true, isMobile: true, viewport: MOBILE_VIEWPORT });

test("7. 모바일 북마크 카드는 탭을 열고 메뉴 사이드바까지 닫는다", async ({
  page,
}) => {
  const { detailLines } = await seedBookmarkContentItems(page);
  await expect(page.locator("#groups-menu")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open", exact: true }),
  ).toHaveCount(0);

  await page.locator(".bookmark-item-open").first().click();

  await expect(page.locator("#bookmarks-panel")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(page.locator("textarea")).toHaveValue(
    ["Bookmark title", "", ...detailLines].join("\n"),
  );
  await expect(page.locator(".tab-item.is-active")).toContainText(
    "Bookmark title",
  );
});
