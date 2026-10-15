import { expect, test } from "@playwright/test";

test("5. 다른 브라우저 탭의 테마 변경을 현재 열린 앱에 반영한다", async ({ page, context }) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("button", { name: "MENU", exact: true }).click();
  await other.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await other.getByRole("radio", { name: "LIGHT" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await other.close();
});
