import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("5. 가이드 최초 포커스는 Next이며 Enter로 다음 단계로 진행한다", async ({
  page,
}) => {
  await page.goto("/");
  const guide = await openGuide(page);
  await expect(
    guide.getByRole("button", { name: "Next", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(guide.locator(".user-guide-progress")).toHaveText("2 / 11");
  await expect(guide.locator("h4")).toHaveText("Write notes");
});
