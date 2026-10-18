import { expect, type Page } from "@playwright/test";

import { hoverTabOverPane, paneSlot, writePaneLayoutState } from "../../__util__";

export async function expectLowerTabSplitRight(
  page: Page,
  options: { allGroup: boolean; hasRightTop: boolean },
) {
  const { allGroup, hasRightTop } = options;
  await writePaneLayoutState(
    page,
    ["top", "bottom-1", "bottom-2", ...(hasRightTop ? ["right-top"] : [])],
    {
      leftBottomTabIds: ["bottom-1", "bottom-2"],
      activeLeftBottomTabId: "bottom-2",
      rightTabIds: hasRightTop ? ["right-top"] : [],
      activeRightTabId: hasRightTop ? "right-top" : null,
    },
    allGroup,
  );
  const bottom = paneSlot(page, "left-bottom");
  const body = bottom.locator(".body");
  const box = (await body.boundingBox())!;
  await bottom
    .getByRole("tab", { name: "bottom-2", exact: true })
    .locator(".tab-title")
    .dragTo(body, { targetPosition: { x: box.width * 0.75, y: box.height * 0.25 } });

  const target = paneSlot(page, hasRightTop ? "right-bottom" : "right");
  await expect(target.locator("textarea")).toHaveValue("bottom-2");
  await expect(bottom.locator(".tab-title")).toHaveText(["bottom-1"]);
  if (hasRightTop) {
    await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("right-top");
  }
}

export async function expectLowerTabSplitRightPersistence(
  page: Page,
  allGroup: boolean,
) {
  await expectLowerTabSplitRight(page, { allGroup, hasRightTop: true });
  await page.reload();
  await expect(paneSlot(page, "right-bottom").locator("textarea")).toHaveValue(
    "bottom-2",
  );
  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue(
    "right-top",
  );
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue(
    "bottom-1",
  );
}

export async function expectThirdBottomTabSplitRight(page: Page, allGroup: boolean) {
  await writePaneLayoutState(
    page,
    ["1", "2", "3"],
    { leftBottomTabIds: ["2", "3"], activeLeftBottomTabId: "3" },
    allGroup,
  );
  const bottom = paneSlot(page, "left-bottom");
  await hoverTabOverPane(
    page,
    bottom.getByRole("tab", { name: "3", exact: true }).locator(".tab-title"),
    bottom,
    0.8,
    0.75,
  );
  await expect(bottom.locator(".note-pane-drop")).toHaveText(["Split right"]);
  await page.mouse.up();
  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("3");
  await expect(bottom.locator("textarea")).toHaveValue("2");
  await expect(paneSlot(page, "left").locator("textarea")).toHaveValue("1");
}
