import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { closeActiveTabWithContent, closedCommand } from "../../__util__";

test("2. PC와 모바일 MENU의 CLOSED 명령은 아이콘·라벨과 괄호 없는 전체 개수를 표시하고 0이면 숨긴다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(closedCommand(page).locator(".closed-count")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await closeActiveTabWithContent(page, "closed note");
  const command = closedCommand(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "MENU", exact: true }).click();
    await expect(command).toContainText("CLOSED");
    await expect(command).not.toContainText("(");
    await expect(command.locator("svg")).toBeInViewport();
    await expect(command.locator(".closed-count")).toHaveText("1");
    await expect(command.locator(".closed-count")).toBeInViewport();
    await page.keyboard.press("Escape");
  }
});
