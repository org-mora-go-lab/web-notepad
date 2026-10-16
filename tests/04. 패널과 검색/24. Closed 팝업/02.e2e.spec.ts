import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openClosedPanel, readStoredState, writeStoredState } from "../../__util__";

test("2. Closed 카드를 에디터로 열면 헤더 제목에 취소선과 그린색을 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await writeStoredState(page, { groups: [createGroupFixture("ungrouped", "Ungrouped", [
      createTabFixture("tab-1", "Normal note", { tabColor: "gray" }),
      createTabFixture("tab-2", "Closed note", { dashboardStatus: "closed", tabColor: "purple", open: false }),
    ])] });
    await openClosedPanel(page);
    await dashboardColumn(page, "closed").locator(".dashboard-card-open").click();
    const tab = page.locator('.tab-item[data-dashboard-status="closed"]');
    await expect(tab.getByRole("tab", { name: "Closed note", exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(tab.locator(".tab-title")).toHaveCSS("text-decoration-line", "line-through");
    await expect(tab.locator(".tab-title")).toHaveCSS("text-decoration-thickness", "1px");
    await expect(page.getByRole("tab", { name: "Normal note", exact: true }).locator(".tab-title")).toHaveCSS("text-decoration-line", "none");
    for (const theme of ["dark", "light"]) {
      await page.evaluate((value) => document.documentElement.dataset.theme = value, theme);
      const colors = await tab.locator(".dirty-dot").evaluate((element) => ({
        actual: getComputedStyle(element, "::before").backgroundColor,
        expected: (() => {
          const sample = document.createElement("span");
          sample.style.color = "var(--color-tab-green)";
          document.body.append(sample);
          const color = getComputedStyle(sample).color;
          sample.remove();
          return color;
        })(),
      }));
      expect(colors.actual).toBe(colors.expected);
    }
    const saved = await readStoredState(page);
    const closed = saved.groups[0].tabs.find((item) => item.id === "tab-2")!;
    expect(closed.dashboardStatus).toBe("closed");
    expect(closed.tabColor).toBe("purple");
  }
});
