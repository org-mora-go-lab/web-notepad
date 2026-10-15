import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx, openSettingsPanel } from "../../__util__";
import { closeSettingsPanel, settingsPanel } from "../__util__";

test("10. 색상 순서 칩에 배경·여백·테마별 글자색과 반응형 크기를 적용한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const hint = settingsPanel(page).locator(".setting-hint");
  const chips = hint.locator(".setting-color-chip");
  await expect(chips).toHaveText(["Gray", "Green", "Purple"]);
  for (const [index, color] of ["rgb(184, 184, 176)", "rgb(143, 227, 176)", "rgb(195, 166, 245)"].entries()) {
    await expect(chips.nth(index)).toHaveCSS("background-color", color);
    await expect(chips.nth(index)).toHaveCSS("color", "rgb(17, 17, 16)");
    await expect(chips.nth(index)).toHaveCSS("padding", "2px 5px");
  }

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expectCssPx(hint, "fontSize", viewport.width <= 640 ? 18 : 15);
  }

  await closeSettingsPanel(page);
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "THEME", exact: true }).click();
  await page.getByRole("radio", { name: "LIGHT" }).click();
  for (const chip of await chips.all()) {
    await expect(chip).toHaveCSS("color", "rgb(250, 252, 251)");
  }
});
