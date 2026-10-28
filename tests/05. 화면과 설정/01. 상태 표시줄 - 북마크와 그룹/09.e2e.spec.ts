import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { groupsCommand, moreCommand, systemGroupCommand } from "../../__util__";

test("9. PC 그룹 사이드바 하단 버튼은 아이콘 없이 작은 글자로 표시한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();
  const fontScale = await page.evaluate(
    () =>
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--font-scale",
        ),
      ) || 1,
  );

  for (const command of [systemGroupCommand(page), moreCommand(page)]) {
    await expect(command.locator(":scope > svg")).toBeHidden();
    await expect(command).toHaveCSS("font-size", `${14 * fontScale}px`);
    await expect(command.locator(":scope > span")).toBeVisible();
  }

  await page.setViewportSize(MOBILE_VIEWPORT);
  for (const command of [systemGroupCommand(page), moreCommand(page)]) {
    await expect(command.locator(":scope > svg")).toBeVisible();
    await expect(command).toHaveCSS("font-size", "16px");
  }
});
