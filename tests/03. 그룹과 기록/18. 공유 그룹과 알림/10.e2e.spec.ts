import { expect, test } from "@playwright/test";

import { openMoreMenu, writeStoredState } from "../../__util__";

test("10. 좁은 한국어 모바일의 Alarm 행은 아이콘과 라벨을 한 줄로 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await writeStoredState(page, { settings: { language: "ko" } });
  const menu = await openMoreMenu(page);
  const button = menu.getByRole("button", { name: "Alarm", exact: true });
  await expect(button).toBeVisible();
  const label = (await button.locator(".status-label").boundingBox())!;
  const icon = (await button.locator("svg").boundingBox())!;
  expect(label.x).toBeGreaterThan(icon.x + icon.width);
  expect(Math.abs(label.y + label.height / 2 - icon.y - icon.height / 2)).toBeLessThan(2);
  await expect(menu).toBeInViewport();
});
