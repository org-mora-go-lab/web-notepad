import { expect, test } from "@playwright/test";

import { openPanel, openSettingsPanel } from "../__util__";

test("16. Panel Position은 좌우 배치와 고정 공간·크기 조절에 적용하고 저장한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = page.locator("#settings-panel");
  await expect(panel.getByRole("radio", { name: "Right", exact: true })).toBeChecked();
  await expect(panel.locator(".setting-section h3").last()).toHaveText("Panel Position");
  await panel.getByRole("radio", { name: "Left", exact: true }).check();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-position", "left");
  expect((await panel.boundingBox())!.x).toBe(0);
  await panel.getByRole("button", { name: "패널 고정", exact: true }).click();
  expect((await page.locator(".workspace").boundingBox())!.x).toBeCloseTo((await panel.boundingBox())!.width, 0);
  const handle = panel.getByRole("separator");
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 100);
  await page.mouse.up();
  expect((await panel.boundingBox())!.width).toBeGreaterThan(box.x + 50);
  await page.reload();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-position", "left");
  await page.keyboard.press("Escape");
  await openPanel(page, "dashboard-panel");
  expect((await page.locator("#dashboard-panel").boundingBox())!.x).toBe(0);
});
