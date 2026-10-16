import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("2. Panel Slide 선택을 현재 설정 패널의 전환 시간에 즉시 반영한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openSettingsPanel(page);

  const panel = settingsPanel(page);
  const on = panel.getByRole("radio", { name: "On", exact: true });
  const off = panel.getByRole("radio", { name: "Off", exact: true });
  await expect(panel).toHaveCSS("transition-duration", "0s");

  await on.check();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "on");
  await expect(panel).toHaveCSS("transition-duration", "0.22s");
  await off.check();
  await expect(page.locator(".home")).toHaveAttribute("data-panel-slide", "off");
  await expect(panel).toHaveCSS("transition-duration", "0s");
});
