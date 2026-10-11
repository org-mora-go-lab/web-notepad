import { expect, test } from "@playwright/test";

test("3. 다른 탭의 테마 변경을 반영하고 저장소가 차단돼도 화면 전환은 동작한다", async ({ page, context, browser }) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("button", { name: "MENU", exact: true }).click();
  await other.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await other.getByRole("menuitemradio", { name: "LIGHT" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await other.close();

  const isolated = await browser.newContext();
  try {
    await isolated.addInitScript(() => {
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
    const blocked = await isolated.newPage();
    await blocked.goto(new URL("/", page.url()).toString());
    await expect(blocked.locator("html")).toHaveAttribute("data-theme", "dark");
    await blocked.getByRole("button", { name: "MENU", exact: true }).click();
    await blocked.getByRole("menuitem", { name: "THEME", exact: true }).click();
    await blocked.getByRole("menuitemradio", { name: "LIGHT" }).click();
    await expect(blocked.locator("html")).toHaveAttribute("data-theme", "light");
  } finally {
    await isolated.close();
  }
});