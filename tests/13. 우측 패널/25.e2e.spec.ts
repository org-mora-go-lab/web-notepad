import { expect, test } from "@playwright/test";

import { openPanel } from "../__util__";
import { dragPanelEdgeTo } from "./__util__";

test("25. 패널은 전체 높이를 채우고 고정 시 작업 영역을 밀며 미고정 시 헤더·푸터를 덮는다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const position of ["Left", "Right"]) {
      await openPanel(page, "settings-panel");
      await page.locator("#settings-panel").getByRole("radio", { name: position, exact: true }).check();
      await page.locator("#settings-panel .side-panel-close").click();
      const header = (await page.locator(".header").boundingBox())!;
      const footer = (await page.locator(".footer").boundingBox())!;
      const checkOriginalLayout = async () => {
        expect(await page.locator(".header").boundingBox()).toEqual(header);
        expect(await page.locator(".footer").boundingBox()).toEqual(footer);
      };
      const panelIds = ["bookmarks-panel", "dashboard-panel", "closed-panel", "global-search-panel", "settings-panel", ...(width > 640 ? ["shortcuts-panel"] : [])];
      for (const panelId of panelIds) {
        await openPanel(page, panelId);
        const panel = page.locator(`#${panelId}`);
        const box = (await panel.boundingBox())!;
        expect(box.y).toBe(0);
        expect(box.height).toBe(844);
        const backdrop = (await panel.locator("..").locator(".side-panel-backdrop").boundingBox())!;
        expect(backdrop).toEqual({ x: 0, y: 0, width, height: 844 });
        await checkOriginalLayout();
        for (const y of [header.height / 2, footer.y + footer.height / 2]) {
          const coveringPanel = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest(".side-panel-drawer")?.id, { x: box.x + box.width / 2, y });
          expect(coveringPanel).toBe(panelId);
        }
        if (width > 640) {
          const checkDocked = async () => {
            const panelBox = (await panel.boundingBox())!;
            for (const selector of [".header", ".footer", ".workspace"]) {
              const workspaceBox = (await page.locator(selector).boundingBox())!;
              expect(workspaceBox.width).toBeCloseTo(width - panelBox.width, 0);
              expect(workspaceBox.x).toBeCloseTo(position === "Left" ? panelBox.width : 0, 0);
            }
          };
          await panel.locator(".side-panel-pin").click();
          await checkDocked();
          if (panelId === "dashboard-panel") {
            await dragPanelEdgeTo(page, panelId, position === "Left" ? 500 : width - 500);
            await checkDocked();
          }
          await panel.locator(".side-panel-pin").click();
          await checkOriginalLayout();
        }
        await panel.locator(".side-panel-close").click();
        await checkOriginalLayout();
      }
    }
  }
});
