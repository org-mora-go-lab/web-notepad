import { expect, test } from "@playwright/test";

test("10. 저장소가 차단되어도 현재 화면의 테마를 전환한다", async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  try {
    await context.addInitScript(() => {
      const getItem = Storage.prototype.getItem;
      const setItem = Storage.prototype.setItem;
      Storage.prototype.getItem = function(key) {
        if (key === "web-notepad-theme") throw new DOMException("Storage blocked", "SecurityError");
        return getItem.call(this, key);
      };
      Storage.prototype.setItem = function(key, value) {
        if (key === "web-notepad-theme") throw new DOMException("Storage blocked", "SecurityError");
        return setItem.call(this, key, value);
      };
    });
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await page.getByRole("radio", { name: "LIGHT" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  } finally {
    await context.close();
  }
});
