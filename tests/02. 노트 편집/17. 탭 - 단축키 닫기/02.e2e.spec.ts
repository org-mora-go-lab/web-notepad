import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";

test("2. Alt/Option+Backspace는 내용이 있는 활성 탭도 확인 없이 닫는다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("Shortcut close confirmation");

  await page.keyboard.press("Alt+Backspace");
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(editor).toHaveValue("");
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.[0].tab.content).toBe("Shortcut close confirmation");
});
