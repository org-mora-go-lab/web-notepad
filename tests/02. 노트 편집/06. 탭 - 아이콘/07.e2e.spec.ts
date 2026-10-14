import { test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx } from "../../__util__";

test("7. 탭 색상 아이콘은 PC에서 11px·버튼 영역 14px, 모바일에서 15.6px·버튼 영역 16.8px이다", async ({
  page,
}) => {
  await page.goto("/");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const mobile = viewport.width <= 640;
    const iconSize = mobile ? 15.6 : 11;
    const buttonSize = mobile ? 16.8 : 14;
    await expectCssPx(colorButton, "width", buttonSize);
    await expectCssPx(colorButton, "height", buttonSize);
    await expectCssPx(colorButton, "width", iconSize, "::before");
    await expectCssPx(colorButton, "height", iconSize, "::before");
  }
});
