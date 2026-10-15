import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";

test("2. 모바일의 모든 요소는 터치할 때 탭 하이라이트를 표시하지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await page.getByRole("button", { name: "MENU" }).click();

  const toggle = page.getByRole("switch", { name: "THEME" });
  await expect(toggle).toHaveCSS("-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator(".theme-toggle")).toHaveCSS(
    "-webkit-tap-highlight-color",
    "rgba(0, 0, 0, 0)",
  );

  expect(
    await page.locator("*").evaluateAll((elements) =>
      elements.every(
        (element) =>
          getComputedStyle(element).getPropertyValue("-webkit-tap-highlight-color") ===
          "rgba(0, 0, 0, 0)",
      ),
    ),
  ).toBe(true);
});
