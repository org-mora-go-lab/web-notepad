import { expect, test } from "@playwright/test";

import { authenticateBrowser, openAccountMenu, writeStoredState } from "../../__util__";

test("10. 좁은 한국어 모바일의 계정 알람은 아이콘과 라벨을 한 줄로 표시한다", async ({ page, context }) => {
  await authenticateBrowser(context); await page.setViewportSize({ width: 320, height: 568 });
  await writeStoredState(page, { settings: { language: "ko" } });
  const menu = await openAccountMenu(page);
  const button = menu.getByRole("menuitem", { name: "알람", exact: true });
  const label = (await button.locator("span").boundingBox())!;
  const icon = (await button.locator("svg").boundingBox())!;
  expect(label.x).toBeGreaterThan(icon.x + icon.width);
  expect(Math.abs(label.y + label.height / 2 - icon.y - icon.height / 2)).toBeLessThan(2);
  await expect(menu).toBeInViewport();
});
