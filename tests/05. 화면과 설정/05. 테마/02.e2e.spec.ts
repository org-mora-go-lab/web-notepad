import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";

test("2. LIGHT는 작업 영역·편집기·하단 메뉴·그룹 메뉴를 일관된 밝은 색으로 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await openSettingsPanel(page);
    await page.getByRole("switch", { name: "THEME" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Close Settings" }).click();
    await expect(page.locator(".workspace")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator("textarea")).toHaveCSS(
      "color",
      "rgb(15, 15, 15)",
    );
    await expect(page.locator(".footer")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await page.locator(".group-select-command").press("Enter");
    await expect(page.locator("#groups-menu")).toHaveCSS(
      "background-color",
      "rgb(242, 242, 242)",
    );
    await page.keyboard.press("Escape");
    await openSettingsPanel(page);
    await page.getByRole("switch", { name: "THEME" }).click();
    await expect(page.locator(".workspace")).toHaveCSS(
      "background-color",
      "rgb(15, 15, 15)",
    );
    await page.getByRole("button", { name: "Close Settings" }).click();
  }
});
