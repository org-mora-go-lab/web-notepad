import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("2. 패널 경계 그라데이션은 좌우 배치에 맞춰 방향과 위치를 반전한다", async ({ page }) => {
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const home = page.locator(".home");
  const panel = page.locator("#bookmarks-panel");
  await home.evaluate((element) => element.setAttribute("data-panel-position", "left"));
  const background = () =>
    panel.evaluate(
      (element) => getComputedStyle(element, "::before").backgroundImage,
    );
  await expect.poll(background).toContain("to left");
  const gradient = await background();
  expect(gradient).toContain("0%");
  expect(gradient).toContain("30%");
  expect(gradient).toContain("65%");
  expect(gradient).toContain("100%");
  expect(gradient).toContain("0.04");
  expect(gradient).toContain("0.104");
  expect(await panel.evaluate((element) => getComputedStyle(element, "::before").left)).toBe(`${(await panel.boundingBox())!.width - 1}px`);

  await home.evaluate((element) => element.setAttribute("data-panel-position", "right"));
  await expect.poll(background).toContain("to right");
});
