import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("1. 첫 가이드 단계에서는 Previous로 이전 범위에 진입할 수 없다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(
    guide.getByRole("button", { name: "Previous", exact: true }),
  ).toBeDisabled();
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
});
