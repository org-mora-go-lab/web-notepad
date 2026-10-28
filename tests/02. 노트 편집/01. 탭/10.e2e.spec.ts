import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";

test("10. PC 탭 제목은 1px 크게 표시하고 모바일 크기는 유지한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");

  const title = page.locator(".tab-item.is-active .tab-title");
  const fontScale = await title.evaluate(
    (element) =>
      Number.parseFloat(
        getComputedStyle(element).getPropertyValue("--font-scale"),
      ) || 1,
  );
  const desktopSize = Number.parseFloat(
    await title.evaluate((element) => getComputedStyle(element).fontSize),
  );
  expect(desktopSize).toBeCloseTo(15 * fontScale - 2, 1);

  await page.setViewportSize(MOBILE_VIEWPORT);
  const mobileSize = Number.parseFloat(
    await title.evaluate((element) => getComputedStyle(element).fontSize),
  );
  expect(mobileSize).toBeCloseTo((16 * 1.2 - 1) * fontScale - 3, 1);
});
