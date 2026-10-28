import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { groupsCommand, moreCommand, systemGroupCommand } from "../../__util__";

test("1. PC와 모바일에서 더보기 버튼과 가이드·검색·북마크 메뉴를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const label = moreCommand(page).locator("span");
  const icon = moreCommand(page).locator("svg").first();

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("MORE");
  await expect(label).toBeInViewport();
  await expect(page.locator(".footer .dashboard-command svg")).toHaveCSS(
    "width",
    "25px",
  );
  await expect(page.locator(".group-more")).toHaveCSS(
    "border-top-width",
    "1px",
  );

  await page.setViewportSize(MOBILE_VIEWPORT);
  const dashboardBounds = (await page
    .locator(".footer .dashboard-command svg")
    .boundingBox())!;
  expect(dashboardBounds.width).toBeCloseTo(29.8, 1);
  await expect(label).toBeInViewport();
  await expect(icon).toBeInViewport();
  await expect(icon).toHaveCSS("width", "25px");
  const labelBox = (await label.boundingBox())!;
  const iconBox = (await icon.boundingBox())!;
  expect(labelBox.x).toBeGreaterThanOrEqual(iconBox.x + iconBox.width);
  const systemBox = (await systemGroupCommand(page).boundingBox())!;
  const dividerBox = (await page.locator(".group-more-divider").boundingBox())!;
  const moreBox = (await moreCommand(page).boundingBox())!;
  expect(systemBox.x + systemBox.width).toBeLessThanOrEqual(dividerBox.x);
  expect(dividerBox.x + dividerBox.width).toBeLessThanOrEqual(moreBox.x);

  await systemGroupCommand(page).click();
  await expect(
    page.locator("#group-system-menu").getByRole("button"),
  ).toHaveText(["All Group", "Ungrouped"]);
  await moreCommand(page).click();
  await expect(page.locator("#group-system-menu")).toHaveCount(0);
  await expect(page.locator("#group-more-menu").getByRole("button")).toHaveText(
    ["GUIDE", "SEARCH", "BOOKMARK", "SETTINGS"],
  );
});
