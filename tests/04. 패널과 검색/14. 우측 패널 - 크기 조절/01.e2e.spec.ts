import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";

test("1. PC 패널 경계선은 접근 가능한 구분선과 2px 선·좌우 조절 커서·hover 강조로 표시한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const handle = page.locator("#dashboard-panel .side-panel-resizer");

  await expect(handle).toHaveAttribute("role", "separator");
  await expect(handle).toHaveAttribute("aria-orientation", "vertical");
  await expect(handle).toHaveCSS("cursor", "col-resize");
  await expect(handle).toHaveCSS("width", "10px");
  expect(
    await handle.evaluate(
      (element) => getComputedStyle(element, "::before").width,
    ),
  ).toBe("2px");
  const color = () =>
    handle.evaluate(
      (element) => getComputedStyle(element, "::before").backgroundColor,
    );
  await expect.poll(color).toBe("rgb(63, 63, 63)");
  await handle.hover();
  await expect.poll(color).toBe("rgb(113, 113, 113)");
});
