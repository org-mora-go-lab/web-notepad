import { expect, test } from "@playwright/test";

import { hoverTabOverPane, paneSlot, writePaneLayoutState } from "./__util__";

test("23. 3분할에서 우측 탭을 좌하단 편집기로 옮길 때 Move here만 표시한다", async ({
  page,
}) => {
  for (const hasExtraTab of [false, true]) {
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
    const source = paneSlot(page, "right").getByRole("tab", {
      name: "right",
      exact: true,
    });
    const target = paneSlot(page, "left-bottom");
    await hoverTabOverPane(
      page,
      source.locator(".tab-title"),
      target,
      0.8,
      0.75,
    );
    await expect(target.locator(".note-pane-drop")).toHaveText(["Move here"]);
    await page.mouse.up();
    await expect(target.locator("textarea")).toHaveValue("right");
    await expect(target.locator(".tab-title")).toHaveText(["bottom", "right"]);
    await expect(page.locator(".pane-slot")).toHaveCount(hasExtraTab ? 3 : 2);
    if (hasExtraTab)
      await expect(paneSlot(page, "right").locator("textarea")).toHaveValue(
        "extra",
      );
  }
});
