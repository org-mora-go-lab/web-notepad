import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("2. PC에서 고정 패널의 손잡이를 편집기 방향으로 드래그하면 패널 너비가 늘어난다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  await panel.getByRole("radio", { name: "Left", exact: true }).check();
  await panel.getByRole("button", { name: "Pin panel", exact: true }).click();
  const before = (await panel.boundingBox())!;
  const handle = panel.getByRole("separator");
  const handleBox = (await handle.boundingBox())!;
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + 100);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 100, handleBox.y + 100);
  await page.mouse.up();
  expect((await panel.boundingBox())!.width).toBeGreaterThan(before.width);
});
