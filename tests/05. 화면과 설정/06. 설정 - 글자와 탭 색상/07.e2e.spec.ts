import { test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { expectCssPx, openSettingsPanel } from "../../__util__";
import { fontScaleRadio } from "../__util__";

test("7. 폰트 비율에 맞춰 PC·모바일 편집기 줄과 줄 번호 높이를 함께 바꾼다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await fontScaleRadio(page, "100%").check();
    const baseline = viewport.width <= 640 ? 39 : 35;
    const editor = page.locator("textarea").first();
    const lineNumber = page.locator(".line-rail span").first();
    await expectCssPx(editor, "lineHeight", baseline);
    await expectCssPx(lineNumber, "height", baseline);

    await fontScaleRadio(page, "120%").check();
    await expectCssPx(editor, "lineHeight", baseline * 1.2);
    await expectCssPx(lineNumber, "height", baseline * 1.2);
  }
});
