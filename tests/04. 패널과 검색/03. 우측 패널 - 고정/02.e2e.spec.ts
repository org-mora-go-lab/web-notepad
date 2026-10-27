import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { groupSelectCommand, openPanel } from "../../__util__";
import { workspaceBounds } from "../__util__";

test("2. 패널은 기본으로 고정되어 우측에 배치되고 헤더·푸터를 포함한 작업 영역이 패널 왼쪽으로 이동한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  const panel = page.locator("#dashboard-panel");

  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const panelBounds = (await panel.boundingBox())!;
  expect(panelBounds.x + panelBounds.width).toBeCloseTo(
    DESKTOP_VIEWPORT.width,
    0,
  );
  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBeCloseTo(panelBounds.x, 0);

  for (const selector of [".header", ".footer"]) {
    const box = (await page.locator(selector).boundingBox())!;
    expect(box.x + box.width).toBeCloseTo(panelBounds.x, 0);
  }
  await expect(groupSelectCommand(page)).toBeInViewport();
});
