import { expect, test } from "@playwright/test";

import { readActiveGroup } from "../../__util__";

test("7. Option+F12 Dashboard 토글은 활성 탭과 패널 배치를 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  await editor.fill("only note");
  const before = await readActiveGroup(page);

  await editor.press("Alt+F12");

  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await expect(editor).toHaveValue("only note");
  const after = await readActiveGroup(page);
  expect({
    activePane: after.activePane,
    activeTabId: after.activeTabId,
    rightTabIds: after.rightTabIds,
  }).toEqual({
    activePane: before.activePane,
    activeTabId: before.activeTabId,
    rightTabIds: before.rightTabIds,
  });
});
