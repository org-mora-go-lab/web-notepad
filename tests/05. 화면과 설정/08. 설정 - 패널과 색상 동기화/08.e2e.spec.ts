import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("8. PC의 왼쪽 고정 패널은 편집 공간을 확보하고 편집기 쪽에 손잡이를 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  await panel.getByRole("radio", { name: "Left", exact: true }).check();
  await panel.getByRole("button", { name: "Pin panel", exact: true }).click();

  const panelBounds = (await panel.boundingBox())!;
  expect((await page.locator(".workspace").boundingBox())!.x).toBeCloseTo(panelBounds.width, 0);
  const handle = panel.getByRole("separator");
  const handleBox = (await handle.boundingBox())!;
  expect(handleBox.x).toBeGreaterThan(panelBounds.x + panelBounds.width / 2);
});
