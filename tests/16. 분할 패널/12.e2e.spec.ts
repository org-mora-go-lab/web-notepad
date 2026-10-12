import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "./__util__";

test("12. 4분할 배치와 활성 탭을 새로고침 후 복원하고 Alt+화살표는 좌상·좌하·우상·우하 순서로 이동한다", async ({ page }) => {
  await seedQuadState(page);
  const panes = ["left", "left-bottom", "right", "right-bottom"];
  const expectFocusedPane = async (pane: string) => {
    for (const id of panes) {
      const notePane = paneSlot(page, id).locator(".note-pane");
      if (id === pane) await expect(notePane).not.toHaveClass(/is-unfocused/);
      else await expect(notePane).toHaveClass(/is-unfocused/);
    }
  };

  await page.reload();
  for (const pane of panes) {
    await expect(paneSlot(page, pane).locator("textarea")).toHaveValue(pane === "right" ? "right-top" : pane === "left" ? "left-top" : pane);
  }

  await paneSlot(page, "left").locator("textarea").click();
  await expectFocusedPane("left");
  for (const pane of panes.slice(1)) {
    await page.keyboard.press("Alt+ArrowDown");
    await expectFocusedPane(pane);
  }
  for (const pane of [...panes].reverse().slice(1)) {
    await page.keyboard.press("Alt+ArrowUp");
    await expectFocusedPane(pane);
  }
});
