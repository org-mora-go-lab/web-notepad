import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { expectCssPx, openSettingsPanel } from "../__util__";
import { fontScaleRadio, settingsPanel } from "./__util__";

test("2. 전체 폰트 크기를 80%~130% 중에서 선택하면 앱 전체 글자 크기와 편집기 줄 높이에 바로 적용한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openSettingsPanel(page);

  const radios = settingsPanel(page)
    .getByRole("radiogroup", { name: "Font Size" })
    .getByRole("radio");
  await expect(radios).toHaveCount(6);
  expect(await radios.evaluateAll(items => items.map(item => item.closest("label")?.textContent)))
    .toEqual(["80%", "90%", "100%", "110%", "120%", "130%"]);
  await expect(fontScaleRadio(page, "100%")).toBeChecked();

  const editor = page.locator("textarea").first();
  const tabTitle = page.locator(".tab-item.is-active .tab-title");
  const panelTitle = settingsPanel(page).getByRole("heading", { name: "Settings" });
  const footer = page.locator(".footer");
  const lineNumber = page.locator(".line-rail span").first();
  await expectCssPx(editor, "fontSize", 19);
  await expectCssPx(editor, "lineHeight", 35);
  await expectCssPx(lineNumber, "height", 35);
  await expectCssPx(tabTitle, "fontSize", 15);
  await expectCssPx(panelTitle, "fontSize", 22);
  await expectCssPx(footer, "fontSize", 14);

  await fontScaleRadio(page, "120%").check();
  await expect(fontScaleRadio(page, "120%")).toBeChecked();
  await expect(fontScaleRadio(page, "100%")).not.toBeChecked();
  await expectCssPx(editor, "fontSize", 22.8);
  await expectCssPx(editor, "lineHeight", 42);
  await expectCssPx(lineNumber, "height", 42);
  await expectCssPx(tabTitle, "fontSize", 18);
  await expectCssPx(panelTitle, "fontSize", 26.4);
  await expectCssPx(footer, "fontSize", 16.8);

  await fontScaleRadio(page, "130%").check();
  await expect(fontScaleRadio(page, "130%")).toBeChecked();
  await expectCssPx(editor, "fontSize", 24.7);
  await expectCssPx(editor, "lineHeight", 45.5);
  await expectCssPx(lineNumber, "height", 45.5);
  await expectCssPx(tabTitle, "fontSize", 19.5);
  await expectCssPx(panelTitle, "fontSize", 28.6);
  await expectCssPx(footer, "fontSize", 18.2);

  await fontScaleRadio(page, "80%").check();
  await expectCssPx(editor, "fontSize", 15.2);
  await expectCssPx(editor, "lineHeight", 28);
  await expectCssPx(tabTitle, "fontSize", 12);
});
