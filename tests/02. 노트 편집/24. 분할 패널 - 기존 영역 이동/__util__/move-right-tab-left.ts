import { expect, type Page } from "@playwright/test";

import { hoverTabOverPane, paneSlot, writePaneLayoutState } from "../../__util__";

export async function expectRightTabMoveLeft(page: Page, hasExtraTab: boolean) {
  await writePaneLayoutState(
    page,
    ["top", "bottom", "right", ...(hasExtraTab ? ["extra"] : [])],
    {
      leftBottomTabIds: ["bottom"],
      activeLeftBottomTabId: "bottom",
      rightTabIds: ["right", ...(hasExtraTab ? ["extra"] : [])],
      activeRightTabId: "right",
    },
  );
  const source = paneSlot(page, "right").getByRole("tab", { name: "right", exact: true });
  const target = paneSlot(page, "left-bottom");
  await hoverTabOverPane(page, source.locator(".tab-title"), target, 0.8, 0.75);
  await expect(target.locator(".note-pane-drop")).toHaveText(["Move here"]);
  await page.mouse.up();
  await expect(target.locator(".tab-title")).toHaveText(["bottom", "right"]);
  await expect(page.locator(".pane-slot")).toHaveCount(hasExtraTab ? 3 : 2);
  if (hasExtraTab) {
    await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("extra");
  } else {
    await expect(paneSlot(page, "right")).toHaveCount(0);
  }
}
