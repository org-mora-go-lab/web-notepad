import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("5. 그룹 패널의 Closed 텍스트를 버튼 가로 중앙에 정렬한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const buttons = page.locator(".group-closed-item .group-select");
  await expect(buttons).toHaveCount(1);

  for (const button of await buttons.all()) {
    const buttonBox = await button.boundingBox();
    const textBox = await button.locator("strong").boundingBox();
    const buttonCenter = buttonBox!.x + buttonBox!.width / 2;
    const textCenter = textBox!.x + textBox!.width / 2;

    expect(Math.abs(buttonCenter - textCenter)).toBeLessThanOrEqual(1);
  }
});
