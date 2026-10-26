import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardPanel, openPanel, toggleDashboardStatus, writeStoredState } from "../../__util__";

test("4. 다섯 상태의 빈 영역은 동일한 디자인과 None 문구를 사용하고 버튼을 표시하지 않는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const language of ["en", "ko"] as const) {
      await writeStoredState(page, {
        groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")])],
        settings: { language },
      });
      await openPanel(page, "dashboard-panel");
      await toggleDashboardStatus(page, "icebox");

      const empty = dashboardPanel(page).locator(".dashboard-empty");
      await expect(empty).toHaveText(["None", "None", "None", "None", "None"]);
      await expect(empty.locator("button")).toHaveCount(0);
      if (viewport.width > 512) {
        await expect(empty.first()).toBeHidden();
        continue;
      }
      for (const area of await empty.all()) {
        await expect(area).toHaveCSS("border-top-style", "dashed");
        await expect(area).toHaveCSS("border-radius", "5px");
        const status = await area.evaluate((element) => element.closest<HTMLElement>(".dashboard-column")!.dataset.status);
        const heading = dashboardPanel(page).locator(viewport.width <= 512
          ? `.dashboard-column[data-status="${status}"] .dashboard-column-status`
          : `.dashboard-statuses [data-status="${status}"]`);
        const bounds = (await area.boundingBox())!;
        const header = (await heading.boundingBox())!;
        expect(bounds.x).toBeCloseTo(header.x, 0);
        expect(bounds.x + bounds.width).toBeCloseTo(header.x + header.width, 0);
      }
      const styles = await empty.evaluateAll((elements) => elements.map((element) => {
        const style = getComputedStyle(element);
        return [style.minHeight, style.backgroundColor, style.border, style.padding, style.textAlign, style.justifyContent];
      }));
      for (const style of styles) expect(style).toEqual(styles[3]);
    }
  }
});
