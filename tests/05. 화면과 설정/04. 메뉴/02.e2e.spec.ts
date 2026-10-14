import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("2. PC MENU 버튼과 드롭다운은 지정된 크기·모서리와 CLOSED 구분선으로 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  const bounds = (await trigger.boundingBox())!;
  expect(bounds.width).toBe(112);
  await expect(trigger.locator("svg")).toHaveCSS("width", "18px");
  await expect(trigger).toHaveCSS("font-size", "15px");
  await expect(trigger.locator("span")).toHaveText("MENU");
  expect(await trigger.locator("span").evaluate(element => getComputedStyle(element).fontFamily)).toMatch(/sans-serif/);
  await trigger.click();
  const menu = page.getByRole("menu", { name: "MENU", exact: true });
  await expect(menu).toHaveCSS("width", "208px");
  await expect(menu).toHaveCSS("border-radius", "6px");
  const closed = page.getByRole("menuitem", { name: "닫은 탭" });
  await expect(closed).toBeVisible();
  expect(await closed.evaluate(element => getComputedStyle(element).borderTopStyle)).not.toBe("none");
  expect(await page.getByRole("menuitem", { name: "SHORTCUT" })
    .evaluate(element => getComputedStyle(element).borderTopStyle)).toBe("none");
});
