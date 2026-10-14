import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("3. 모바일 MENU 버튼은 너비 45px·아이콘 26.4px로 표시하고 라벨을 숨기며 드롭다운은 너비 240px로 표시한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  await expect(trigger).toBeInViewport();
  const bounds = (await trigger.boundingBox())!;
  expect(bounds.width).toBe(45);
  await expect(trigger.locator("svg")).toBeVisible();
  await expectCssPx(trigger.locator("svg"), "width", 26.4);
  await expect(trigger.locator("span")).toBeHidden();
  await trigger.click();
  const menu = page.getByRole("menu", { name: "MENU", exact: true });
  await expect(menu).toHaveCSS("width", "240px");
  await expect(menu).toHaveCSS("border-radius", "4px");
  await expect(menu).toBeInViewport({ ratio: 1 });
});
