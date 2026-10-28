import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { groupsCommand, moreCommand, systemGroupCommand } from "../../__util__";

test("8. 모바일 그룹 사이드바 하단 버튼의 아이콘과 라벨을 함께 왼쪽으로 배치한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await groupsCommand(page).click();

  for (const command of [systemGroupCommand(page), moreCommand(page)]) {
    const button = (await command.boundingBox())!;
    const icon = (await command.locator(":scope > svg").boundingBox())!;
    const label = (await command.locator(":scope > span").boundingBox())!;
    const contentCenter = (icon.x + label.x + label.width) / 2;

    expect(label.x - (icon.x + icon.width)).toBeCloseTo(10, 0);
    expect(button.x + button.width / 2 - contentCenter).toBeCloseTo(10, 0);
  }
});
