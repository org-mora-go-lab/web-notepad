import { expect, test } from "@playwright/test";

import { activeTabItem, lineButtons } from "../__util__";

test("6. LIGHT에서 선택한 라인 번호와 편집기 선택 줄은 같은 LIGHT 강조 배경색을 사용하고 DARK 선택 색상은 유지한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("first\nsecond");
  const line = lineButtons(page).first();
  await line.click();
  await expect(line).toHaveCSS("background-color", "rgba(143, 227, 176, 0.2)");

  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const colorButton = activeTabItem(page).locator(".dirty-dot");
  for (const color of ["rgba(37, 131, 86, 0.15)", "rgba(104, 119, 110, 0.15)", "rgba(184, 75, 69, 0.13)"]) {
    await expect(line).toHaveCSS("background-color", color);
    await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).backgroundImage))
      .toContain(color);
    await colorButton.click();
  }

  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "DARK" }).click();
  await expect(line).toHaveCSS("background-color", "rgba(143, 227, 176, 0.2)");
});
