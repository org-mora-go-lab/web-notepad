import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { groupSelectCommand, openPanel } from "../../__util__";
import { workspaceBounds } from "../__util__";

test("2. 패널은 푸터 위 우측에 고정되고 작업 영역만 패널 왼쪽으로 이동한다", async ({
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

  const headerBox = (await page.locator(".header").boundingBox())!;
  expect(headerBox.x + headerBox.width).toBeCloseTo(panelBounds.x, 0);
  const footerBox = (await page.locator(".footer").boundingBox())!;
  expect(footerBox.x).toBe(0);
  expect(footerBox.width).toBeCloseTo(DESKTOP_VIEWPORT.width, 0);
  expect(panelBounds.y + panelBounds.height).toBeCloseTo(footerBox.y, 0);
  await expect(groupSelectCommand(page)).toBeInViewport();
});
