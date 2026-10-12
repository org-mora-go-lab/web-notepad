import { expect, test } from "@playwright/test";

import { seedTimedBookmarks } from "./__util__";

test.use({ timezoneId: "UTC" });

test("6. 북마크 시각은 제목 길이와 관계없이 고정된 우측 영역(높이 PC 32px·모바일 38px)에 표시하고 긴 제목은 말줄임 처리한다", async ({ page }) => {
  await seedTimedBookmarks(page);
  const headings = page.locator(".bookmark-item-heading");
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(headings.first().locator("xpath=ancestor::aside")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    await expect(headings.locator("time")).toHaveCount(2);
    const bounds = [];
    for (const heading of await headings.all()) {
      const time = heading.locator("time");
      await expect(time).toHaveCSS("flex-shrink", "0");
      await expect(time).toHaveCSS("height", width <= 640 ? "38px" : "32px");
      // 12ch measured in the time element's own font.
      const twelveCh = await time.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.cssText = "display:inline-block;width:12ch;padding:0;border:0";
        element.appendChild(probe);
        const probeWidth = probe.getBoundingClientRect().width;
        probe.remove();
        return probeWidth;
      });
      const timeBounds = (await time.boundingBox())!;
      expect(timeBounds.width).toBeCloseTo(twelveCh, 0);
      const titleBounds = (await heading.locator("strong").boundingBox())!;
      expect(titleBounds.x + titleBounds.width).toBeLessThanOrEqual(timeBounds.x);
      const headingBounds = (await heading.boundingBox())!;
      expect(timeBounds.x + timeBounds.width).toBeCloseTo(headingBounds.x + headingBounds.width, 1);
      bounds.push(timeBounds);
    }
    expect(bounds[0].x).toBeCloseTo(bounds[1].x, 1);
    expect(bounds[0].width).toBeCloseTo(bounds[1].width, 1);
    await expect(page.locator(".bookmark-item-heading strong").last()).toHaveCSS("text-overflow", "ellipsis");
  }
});
