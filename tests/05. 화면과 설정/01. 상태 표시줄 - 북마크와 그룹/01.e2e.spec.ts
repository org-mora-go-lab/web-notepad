import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { moreCommand } from "../../__util__";

test("1. PC와 모바일에서 더보기 버튼과 가이드·검색·북마크 메뉴를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const label = moreCommand(page).locator(".status-label");
  const icon = moreCommand(page).locator("svg").first();

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("MORE");
  await expect(label).toBeInViewport();
  await expect(icon).toBeInViewport();
  for (const command of ["more", "dashboard"]) {
    const footerIcon = page.locator(`.footer .${command}-command svg`);
    await expect(footerIcon).toHaveCSS("width", "25px");
    await expect(footerIcon).toHaveCSS("height", "25px");
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  for (const command of ["more", "dashboard"]) {
    const footerIcon = page.locator(`.footer .${command}-command svg`);
    const bounds = (await footerIcon.boundingBox())!;
    expect(bounds.width).toBeCloseTo(29.8, 1);
    expect(bounds.height).toBeCloseTo(29.8, 1);
  }
  await expect(label).toBeInViewport();
  await expect(icon).toBeInViewport();
  const labelBox = (await label.boundingBox())!;
  const iconBox = (await icon.boundingBox())!;
  expect(labelBox.y).toBeGreaterThanOrEqual(iconBox.y + iconBox.height);
  await moreCommand(page).click();
  await expect(
    page.locator("#footer-more-menu").getByRole("button"),
  ).toHaveText(["GUIDE", "SEARCH", "Bookmark"]);
});
