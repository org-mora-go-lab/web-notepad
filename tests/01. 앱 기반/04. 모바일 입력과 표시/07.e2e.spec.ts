import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { groupsCommand, openGlobalSearchPanel } from "../../__util__";

test("7. 마우스 입력 기기는 전체 폰트 설정에 따른 입력란 크기를 적용한다", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ state: { settings: { fontScale: 0.8 } }, version: 0 }));
  }, STORAGE_KEY);
  await page.goto("/");
  expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(false);

  const expectBelowTouchMinimum = async (selector: string) => {
    const size = await page.locator(selector).first().evaluate(
      (element) => parseFloat(getComputedStyle(element).fontSize),
    );
    expect(size).toBeLessThan(16);
  };

  await expectBelowTouchMinimum(".note-area");
  await openGlobalSearchPanel(page);
  await expectBelowTouchMinimum("#global-search-panel input");
  await page.keyboard.press("Escape");
  await groupsCommand(page).click();
  await expectBelowTouchMinimum(".group-create-form input");
});
