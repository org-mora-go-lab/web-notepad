import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("3. 설정 초기화 버튼을 고정 버튼 왼쪽에 배치한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const reset = panel.locator(".setting-reset");
  const pin = panel.locator(".side-panel-pin");
  const close = panel.getByRole("button", { name: "Close Settings", exact: true });
  const pinBounds = (await pin.boundingBox())!;
  const resetBounds = (await reset.boundingBox())!;
  const closeBounds = (await close.boundingBox())!;
  expect(resetBounds.x + resetBounds.width).toBeLessThanOrEqual(pinBounds.x);
  expect(pinBounds.x + pinBounds.width).toBeLessThanOrEqual(closeBounds.x);
  expect(resetBounds.width).toBeCloseTo(closeBounds.width, 0);
  expect(resetBounds.height).toBeCloseTo(closeBounds.height, 0);
});
