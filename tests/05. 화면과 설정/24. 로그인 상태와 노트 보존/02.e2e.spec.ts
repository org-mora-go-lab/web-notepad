import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT, MOBILE_VIEWPORT } from "../../__constant__";
import { authenticateBrowser } from "../../__util__";

test("2. 프로필 이미지가 없는 계정은 사용자 아이콘을 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  await page.goto("/");
  await expect(
    page.locator("button.auth-command .lucide-circle-user-round"),
  ).toBeVisible();
  await expect(page.locator("button.auth-command img")).toHaveCount(0);
  const icon = page.locator("button.auth-command svg");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(icon).toHaveCSS("width", "24px");
  await page.setViewportSize(MOBILE_VIEWPORT);
  expect((await icon.boundingBox())!.width).toBeCloseTo(28.8, 1);
});
