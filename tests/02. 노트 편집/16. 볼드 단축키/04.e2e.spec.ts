import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("4. Cmd+B는 그룹 패널을 열지 않고 Option+F11만 그룹을 연다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("text");
  await editor.selectText();

  await editor.press("Meta+b");
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "false");
  await editor.press("Alt+F11");
  await expect(groupsCommand(page)).toHaveAttribute("aria-expanded", "true");
});
