import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";
import { hoverTabOverPane, paneSlot, seedQuadState } from "./__util__";

test("12. 탭이 하나뿐인 패널은 그 탭으로 분할하지 않고 4분할 상태에서는 분할 영역을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const onlyTab = page.locator(".tab-item").first();
  const left = paneSlot(page, "left");

  // A pane with a single tab cannot be split by that tab.
  const releaseSingle = await hoverTabOverPane(page, onlyTab, left, 0.25, 0.75);
  await expect(left.locator(".note-pane-drop", { hasText: /Split/ })).toHaveCount(0);
  await releaseSingle();
  await expect(page.locator(".pane-slot")).toHaveCount(1);

  // Once the pane has another tab, the same drag offers both split zones.
  await addTabButton(page).click();
  const releaseMulti = await hoverTabOverPane(page, onlyTab, left, 0.25, 0.75);
  await expect(left.locator(".note-pane-drop", { hasText: /Split/ })).toHaveText(["Split right", "Split down"]);
  await releaseMulti();
  await expect(page.locator(".pane-slot")).toHaveCount(1);

  // With four panes open there is nowhere left to split.
  await seedQuadState(page);
  const tab = page.locator(".tab-item").filter({ hasText: /^left-top$/ });
  const target = paneSlot(page, "right-bottom");
  const release = await hoverTabOverPane(page, tab, target, 0.5, 0.75);
  await expect(target.locator(".note-pane-drop")).toHaveText(["Move here"]);
  await release();
  await expect(page.locator(".pane-slot")).toHaveCount(4);
});
