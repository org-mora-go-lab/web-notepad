import { expect, test } from "@playwright/test";

test("6. PC 탭은 최대 너비 300.655px, 높이 39px이며 헤더와 탭 조작 버튼 및 패널 탭 행 높이도 39px이다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await expect(tab).toHaveCSS("height", "39px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "39px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "39px");
  await expect(page.locator(".header")).toHaveCSS("height", "39px");
  await expect(page.locator(".add-tab")).toHaveCSS("height", "39px");
  await expect.poll(() => page.locator(".note-pane").evaluate(
    (element) => getComputedStyle(element).gridTemplateRows.split(" ")[0],
  )).toBe("39px");
  await expect(tab).toHaveCSS("min-width", "130.485px");
  await expect(tab).toHaveCSS("max-width", "300.655px");
});
