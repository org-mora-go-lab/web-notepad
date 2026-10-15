import { expect, test } from "@playwright/test";

import { activeTabItem, lineButtons, selectTabColorSetting } from "../../__util__";

test("6. LIGHT에서 라인 번호와 편집기 선택 줄에 탭 색상별 강조 배경을 함께 적용한다", async ({ page }) => {
  await page.goto("/");
  await selectTabColorSetting(page, 3, "Red");
  const editor = page.locator("textarea");
  await editor.fill("first\nsecond");
  const line = lineButtons(page).first();
  await line.click();

  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("radio", { name: "LIGHT" }).click();

  const colorButton = activeTabItem(page).locator(".dirty-dot");
  for (const color of ["rgba(104, 119, 110, 0.15)", "rgba(37, 131, 86, 0.15)", "rgba(184, 75, 69, 0.13)"]) {
    await expect(line).toHaveCSS("background-color", color);
    await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).backgroundImage))
      .toContain(color);
    await colorButton.click();
  }
});
