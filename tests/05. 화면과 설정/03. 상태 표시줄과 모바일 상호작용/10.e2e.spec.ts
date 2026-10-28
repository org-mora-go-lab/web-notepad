import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";

test("10. PC 아이콘 hover 배경은 3px 모서리와 동일한 바깥 간격을 사용한다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await page.locator(".group-select-command").click();

  for (const selector of [".more-command svg", ".group-select-command svg"]) {
    const icon = page.locator(selector).first();
    await icon.hover();
    await expect(icon).toHaveCSS("border-radius", "3px");
    await expect(icon).toHaveCSS(
      "background-color",
      "rgba(180, 180, 180, 0.18)",
    );
    await expect(icon).toHaveCSS(
      "box-shadow",
      "rgba(180, 180, 180, 0.18) 0px 0px 0px 4px",
    );
  }
});
