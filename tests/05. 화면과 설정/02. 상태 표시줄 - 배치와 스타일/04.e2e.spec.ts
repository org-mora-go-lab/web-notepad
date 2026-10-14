import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";

test("4. 하단 메뉴 아이콘 크기를 PC 24px·모바일 28.8px로 표시한다", async ({ page }) => {
  await page.goto("/");
  const commands = page.locator(".status-meta .status-command:visible");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    for (const command of await commands.all()) {
      await expect(command.locator("svg")).toHaveCSS("width", mobile ? /^28\.(8|79)/ : "24px");
      await expect(command.locator("svg")).toHaveCSS("height", mobile ? /^28\.(8|79)/ : "24px");
    }
  }
});
