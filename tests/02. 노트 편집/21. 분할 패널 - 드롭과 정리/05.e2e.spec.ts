import { expect, test } from "@playwright/test";

import { paneSlot, writePaneLayoutState } from "../__util__";

test("5. 일반 그룹의 하단 탭은 기존 우상단을 유지하고 우하단으로 이동한다", async ({
  page,
}) => {
  await writePaneLayoutState(
    page,
    ["top", "bottom-1", "bottom-2", "right-top"],
    {
      leftBottomTabIds: ["bottom-1", "bottom-2"],
      activeLeftBottomTabId: "bottom-2",
      rightTabIds: ["right-top"],
      activeRightTabId: "right-top",
    },
    false,
  );
  const bottom = paneSlot(page, "left-bottom");
  const body = bottom.locator(".body");
  const bodyBox = (await body.boundingBox())!;

  await bottom
    .getByRole("tab", { name: "bottom-2", exact: true })
    .locator(".tab-title")
    .dragTo(body, {
      targetPosition: { x: bodyBox.width * 0.75, y: bodyBox.height * 0.25 },
    });

  await expect(paneSlot(page, "right-bottom").locator("textarea")).toHaveValue(
    "bottom-2",
  );
  await expect(bottom.locator(".tab-title")).toHaveText(["bottom-1"]);
  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue(
    "right-top",
  );
});
