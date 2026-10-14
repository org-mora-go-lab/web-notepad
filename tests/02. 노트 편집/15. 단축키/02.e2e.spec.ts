import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("2. Alt+위아래 화살표는 같은 패널의 탭 사이를 이동한다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await addTabButton(page).click();
  await page.keyboard.press("Alt+ArrowUp");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});
