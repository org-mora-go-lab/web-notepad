import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { lineButtons } from "../__util__";

test("10. 줄 번호와 선택 강조 영역을 같은 줄 높이에 맞춰 정렬하고 선택 색상은 줄 전체를 채운다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const lines = lineButtons(page);
  await editor.fill("First line\nSecond line");
  await expect(lines).toHaveCount(2);

  await expect(lines.first()).toHaveCSS("height", "35px");
  await expect(lines.first()).toHaveCSS("line-height", "35px");
  await lines.first().click();
  await expect(editor).toHaveCSS("background-size", "100% 45px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(lines.first()).toHaveCSS("height", "39px");
  await expect(lines.first()).toHaveCSS("line-height", "39px");
  await expect(editor).toHaveCSS("background-size", "100% 49px");
  await expect(lines.first()).toHaveCSS(
    "background-color",
    "rgba(143, 227, 176, 0.2)",
  );
});
