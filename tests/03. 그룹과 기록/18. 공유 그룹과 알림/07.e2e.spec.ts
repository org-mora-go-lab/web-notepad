import { expect, test } from "@playwright/test";

import { openMoreMenu } from "../../__util__";

test("7. PC와 모바일 더보기에는 설정을 표시하고 그룹 알림은 표시하지 않는다", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const menu = await openMoreMenu(page);
    await expect(menu.getByRole("button")).toHaveText([
      "GUIDE",
      "SEARCH",
      "BOOKMARK",
      "SETTINGS",
    ]);
    await expect(menu.getByRole("button", { name: /Alarm|알람/ })).toHaveCount(
      0,
    );
    await expect(page.locator(".more-command .notification-count")).toHaveCount(
      0,
    );
    await page.keyboard.press("Escape");
  }
});
