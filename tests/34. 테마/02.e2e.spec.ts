import { expect, test } from "@playwright/test";

test("2. 테마는 노트와 별도로 저장·복원하며 잘못된 저장값은 DARK로 처리한다", async ({ page, context }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem("web-notepad-theme") === null) localStorage.setItem("web-notepad-theme", "invalid");
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("textarea").fill("Keep this note");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "LIGHT" }).click();
  expect(await page.evaluate(() => localStorage.getItem("web-notepad-theme"))).toBe("light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("textarea")).toHaveValue("Keep this note");
  const reopened = await context.newPage();
  await reopened.goto("/");
  await expect(reopened.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(reopened.locator("textarea")).toHaveValue("Keep this note");
  await reopened.close();
});