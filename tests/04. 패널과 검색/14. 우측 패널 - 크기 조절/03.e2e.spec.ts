import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("3. 우측에 배치한 미고정 패널의 크기를 조절할 수 있다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  const panel = page.locator("#bookmarks-panel");

  await dragPanelEdgeTo(
    page,
    "bookmarks-panel",
    DESKTOP_VIEWPORT.width - 520,
  );

  await expect
    .poll(async () => (await panel.boundingBox())!.width)
    .toBeCloseTo(520, 1);
});
