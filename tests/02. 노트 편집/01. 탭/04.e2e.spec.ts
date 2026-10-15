import { expect, test } from "@playwright/test";

import { activeTabItem } from "../../__util__";

test("4. 저장 기준과 다른 내용에 변경 표시를 보여준다", async ({ page }) => {
  await page.goto("/");
  const tab = activeTabItem(page);
  const editor = page.locator("textarea");
  await expect(tab).not.toHaveClass(/is-dirty/);
  await editor.fill("changed");
  await expect(tab).toHaveClass(/is-dirty/);
  await editor.fill("");
  await expect(tab).not.toHaveClass(/is-dirty/);
});
