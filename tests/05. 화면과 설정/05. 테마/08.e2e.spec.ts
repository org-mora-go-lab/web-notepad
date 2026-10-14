import { expect, test } from "@playwright/test";

import { lineButtons } from "../../__util__";

test("8. DARK에서 라인 번호와 편집기 선택 줄의 기존 강조색을 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("first\nsecond");
  const line = lineButtons(page).first();
  await line.click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(line).toHaveCSS("background-color", "rgba(184, 184, 176, 0.2)");
  await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).backgroundImage))
    .toContain("rgba(184, 184, 176, 0.2)");
});
