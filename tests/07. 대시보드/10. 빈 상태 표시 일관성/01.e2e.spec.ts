import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardPanel, openPanel, toggleDashboardStatus, writeStoredState } from "../../__util__";

test("1. 다섯 상태의 빈 영역은 동일한 디자인과 None 문구를 사용하고 버튼을 표시하지 않는다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const language of ["en", "ko"] as const) {
      await writeStoredState(page, {
        groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")])],
        settings: { language },
      });
      await openPanel(page, "dashboard-panel");
      await toggleDashboardStatus(page, "icebox");
      await toggleDashboardStatus(page, "closed");
      const empty = dashboardPanel(page).locator(".dashboard-empty");
      await expect(empty).toHaveText(["None", "None", "None", "None", "None"]);
      await expect(empty.locator("button")).toHaveCount(0);
      const styles = await empty.evaluateAll((elements) => elements.map((element) => {
        const style = getComputedStyle(element);
        return [style.minHeight, style.backgroundColor, style.border, style.padding, style.textAlign, style.justifyContent];
      }));
      for (const style of styles) expect(style).toEqual(styles[3]);
    }
  }
});
