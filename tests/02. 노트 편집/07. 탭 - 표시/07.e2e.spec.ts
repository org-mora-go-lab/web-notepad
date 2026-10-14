import { expect, test } from "@playwright/test";

test("7. PC의 탭과 헤더 및 탭 조작 행 높이는 39px다", async ({ page }) => {
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
});
