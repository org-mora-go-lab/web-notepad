import { expect, test } from "@playwright/test";

import { lineButtons } from "../../__util__";

test("4. 첫 줄 선택 배경은 편집기 상단 여백까지 이어진다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const rail = page.locator(".line-rail");
  const lines = lineButtons(page);
  await editor.fill("first\nsecond\nthird");
  await lines.first().click();

  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(rail).toHaveCSS("background-image", /rgba\(184, 184, 176, 0\.2\)/);
  await expect(rail).toHaveCSS("background-size", "100% 10px");
  await expect(editor).toHaveCSS("background-position", /0px 0px/);
  await expect(editor).toHaveCSS("background-size", "100% 45px");
});
