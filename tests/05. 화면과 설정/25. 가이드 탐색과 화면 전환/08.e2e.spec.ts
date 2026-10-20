import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide } from "../../__util__";

test("8. PC 마지막 단계에서 모바일로 바꾸어도 유효한 마지막 단계와 닫기를 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  for (let i = 0; i < 10; i++)
    await guide.getByRole("button", { name: "Next", exact: true }).click();
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(guide.locator(".user-guide-progress")).toHaveText("10 / 10");
  await expect(guide.locator("h4")).toHaveText("Panels beside the editor");
  await guide.getByRole("button", { name: "Close", exact: true }).click();
  await expect(guide).toHaveCount(0);
});
