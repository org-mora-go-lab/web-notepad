import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { bookmarksCommand } from "../../__util__";

test("1. PC는 BOOKMARK 아이콘과 라벨을, 모바일은 아이콘 아래에 라벨을 표시한다", async ({ page }) => {
  await page.goto("/");
  const label = bookmarksCommand(page).locator(".status-label");
  const icon = bookmarksCommand(page).locator("svg");

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(label).toHaveText("BOOKMARK");
  await expect(label).toBeInViewport();
  await expect(icon).toBeInViewport();
  for (const command of ["bookmark", "dashboard"]) {
    const footerIcon = page.locator(`.footer .${command}-command svg`);
    await expect(footerIcon).toHaveCSS("width", "25px");
    await expect(footerIcon).toHaveCSS("height", "25px");
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  for (const command of ["bookmark", "dashboard"]) {
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
});
