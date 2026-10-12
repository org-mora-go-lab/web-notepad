import { expect, test } from "@playwright/test";

import { seedTimedBookmarks } from "./__util__";

test.use({ timezoneId: "UTC" });

test("7. 북마크 시각은 YY. MM. DD 날짜와 hh:mm:ss AM/PM 시간을 줄바꿈 없이 두 줄로 표시한다", async ({ page }) => {
  await seedTimedBookmarks(page);
  const times = page.locator(".bookmark-item-heading time");
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(times).toHaveCount(2);
    for (const time of await times.all()) {
      await expect(time).toHaveText("26. 10. 11\n11:30:00 AM", { useInnerText: true });
      await expect(time).toHaveAttribute("datetime", "2026-10-11T11:30:00.000Z");
      await expect(time).toHaveCSS("white-space", "pre");
      expect(await time.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
  }
});
