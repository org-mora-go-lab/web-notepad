import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openPanel, writeStoredState } from "../../__util__";
import { dashboardPanel } from "../__util__";

test("3. 스크롤한 카드 목록 위에 테마별 fog를 표시하고 맨 위에서는 제거한다", async ({ page }) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [createGroupFixture("ungrouped", "Ungrouped", Array.from({ length: 30 }, (_, i) => createTabFixture(`tab-${i}`, `Task ${i}\nBody`)))],
  });
  await openPanel(page, "dashboard-panel");
  const panel = dashboardPanel(page);
  const list = panel.locator(".dashboard-list");
  const statuses = panel.locator(".dashboard-statuses");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const color of ["#111110", "#fafcfb"]) {
      // Exercise both theme backgrounds without changing the user's persisted theme.
      await panel.evaluate((el, background) => { el.style.setProperty("--color-panel", background); }, color);
      await list.evaluate((el) => { el.scrollTop = 0; });
      await expect.poll(() => statuses.evaluate((el) => getComputedStyle(el, "::after").opacity)).toBe("0");
      await list.evaluate((el) => { el.scrollTop = 100; });
      await expect.poll(() => statuses.evaluate((el) => getComputedStyle(el, "::after").opacity)).toBe("1");
      const fog = await statuses.evaluate((el) => {
        const style = getComputedStyle(el, "::after");
        return { height: style.height, pointerEvents: style.pointerEvents, background: style.backgroundImage, transitionDuration: style.transitionDuration };
      });
      expect(fog.height).toBe("48px");
      expect(fog.pointerEvents).toBe("none");
      expect(fog.background).toContain("linear-gradient");
      expect(fog.background).toContain("35%");
      expect(fog.background).toContain("70%");
      expect(fog.transitionDuration).toBe("0.18s");
      expect(fog.background).toContain(color === "#111110" ? "rgb(17, 17, 16)" : "rgb(250, 252, 251)");
      const titleBox = (await statuses.boundingBox())!;
      const hit = await page.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest(".dashboard-list"), { x: titleBox.x + titleBox.width / 2, y: titleBox.y + titleBox.height + 5 });
      expect(hit).toBe(true);
      await list.evaluate((el) => { el.scrollTop = 0; });
      await expect.poll(() => statuses.evaluate((el) => getComputedStyle(el, "::after").opacity)).toBe("0");
    }
  }
});
