import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await guide.getByRole("button", { name: "Next", exact: true }).click();
  await guide.getByRole("button", { name: "Next", exact: true }).click();
  await page.keyboard.press("Escape");
  await openGuide(page);
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 11");
  await expect(guide.locator("h4")).toHaveText("Keyboard shortcuts");
});
