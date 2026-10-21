import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("6. Option+F11은 Group을 열고 닫는다", async ({ page }) => {
  await page.goto("/");
  const groups = groupsCommand(page);

  await page.locator("textarea").press("Alt+F11");
  await expect(groups).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Alt+F11");
  await expect(groups).toHaveAttribute("aria-expanded", "false");
});
