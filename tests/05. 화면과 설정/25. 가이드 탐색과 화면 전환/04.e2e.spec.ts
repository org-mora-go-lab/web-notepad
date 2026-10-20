import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("4. 가이드 바깥 배경을 클릭하면 닫고 노트 편집을 계속한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("textarea").fill("Guide backdrop note");
  const guide = await openGuide(page);
  await page.mouse.click(4, 4);
  await expect(guide).toHaveCount(0);
  await expect(page.locator("textarea")).toHaveValue("Guide backdrop note");
  await page.locator("textarea").fill("Editing continues");
  await expect(page.locator("textarea")).toHaveValue("Editing continues");
});
