import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel } from "../../__util__";

test("8. 모든 사이드 패널은 PC·모바일과 좌우 배치에서 화면 전체 높이를 채운다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const position of ["Left", "Right"]) {
      await openSettingsPanel(page);
      await page.locator("#settings-panel").getByRole("radio", { name: position, exact: true }).check();
      await page.locator("#settings-panel .side-panel-close").click();
      const ids = ["bookmarks-panel", "dashboard-panel", "global-search-panel", "settings-panel", ...(width > 640 ? ["shortcuts-panel"] : [])];
      for (const id of ids) {
        await openPanel(page, id);
        const box = (await page.locator(`#${id}`).boundingBox())!;
        expect(box.y).toBeCloseTo(0, 0);
        expect(box.height).toBeCloseTo(844, 0);
        await page.locator(`#${id} .side-panel-close`).click();
      }
    }
  }
});
