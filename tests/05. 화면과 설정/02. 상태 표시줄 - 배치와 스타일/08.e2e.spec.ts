import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("8. PC 하단 메뉴는 아이콘 오른쪽에 라벨과 그룹명을 7px 간격으로 표시한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");

  for (const command of await page.locator(".status-meta .status-command:visible").all()) {
    await expect(command).toHaveCSS("flex-direction", "row");
    await expect(command).toHaveCSS("gap", "7px");
    const icon = (await command.locator("svg").boundingBox())!;
    const label = (await command.locator(".status-label, .group-select-name").boundingBox())!;
    expect(label.x).toBeGreaterThanOrEqual(icon.x + icon.width + 7 - 1);
  }
});
