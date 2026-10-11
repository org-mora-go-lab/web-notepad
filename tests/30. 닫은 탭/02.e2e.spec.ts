import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../__util__";

test("2. PC와 모바일 MENU의 CLOSED 명령은 전체 개수를 표시하고 패널을 연다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(closedCommand(page).locator(".closed-count")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await closeActiveTabWithContent(page, "closed note");
  const command = closedCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(page.locator('.status-bar [aria-controls="closed-panel"]')).toHaveCount(0);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await expect(command).toContainText("CLOSED");
    await expect(command.locator("svg")).toBeInViewport();
    await expect(command.locator(".closed-count")).toHaveText("1");
    await expect(command.locator(".closed-count")).toBeInViewport();
    await command.click();
    await expect(page.getByRole("button", { name: "MENU", exact: true })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#closed-panel")).toHaveAttribute("aria-hidden", "false");
    await expect(page.locator(".closed-item")).toHaveCount(1);
    await page.keyboard.press("Escape");
  }
});
