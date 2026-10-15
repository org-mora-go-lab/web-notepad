import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("5. All, Ungrouped, Closed 텍스트를 각 버튼의 가로 중앙에 정렬한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const buttons = page.locator(".group-split-row .group-select");
  await expect(buttons).toHaveCount(3);

  for (const button of await buttons.all()) {
    const buttonBox = await button.boundingBox();
    const textBox = await button.locator("strong").boundingBox();
    const buttonCenter = buttonBox!.x + buttonBox!.width / 2;
    const textCenter = textBox!.x + textBox!.width / 2;

    expect(Math.abs(buttonCenter - textCenter)).toBeLessThanOrEqual(1);
  }
});
