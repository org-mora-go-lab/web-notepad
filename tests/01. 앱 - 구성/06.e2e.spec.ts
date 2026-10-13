import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT, STORAGE_KEY } from "../__constant__";
import { chooseGroupAction, createGroup, groupsCommand } from "../__util__";

test.use({ viewport: MOBILE_VIEWPORT, isMobile: true, hasTouch: true });

test("6. 터치 기기에서는 에디터·검색창·그룹 이름 입력란 글자를 최소 16px로 유지해 iOS 입력 확대를 막는다", async ({ page }) => {
  // The smallest font scale would otherwise push every field under 16px.
  await page.addInitScript((key) => {
    if (sessionStorage.getItem("touch-font-seed")) return;
    localStorage.setItem(key, JSON.stringify({ state: { settings: { fontScale: 0.8 } }, version: 0 }));
    sessionStorage.setItem("touch-font-seed", "true");
  }, STORAGE_KEY);
  await page.goto("/");
  expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);

  const fontSize = (selector: string) =>
    page.locator(selector).first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  expect(await fontSize(".note-area")).toBeGreaterThanOrEqual(16);

  await groupsCommand(page).click();
  await createGroup(page, "Alpha");
  expect(await fontSize(".group-create-form input")).toBeGreaterThanOrEqual(16);
  await chooseGroupAction(page, "Alpha", "수정");
  await expect(page.getByRole("textbox", { name: "Alpha 그룹 이름 수정" })).toBeVisible();
  expect(await fontSize(".group-edit-form input")).toBeGreaterThanOrEqual(16);
});
