import { expect, test } from "@playwright/test";

import { readStoredState, seedStoredStateOnLoad } from "../../__util__";

test("6. 필수 표시 필드가 없는 탭은 기본값으로 정규화해 편집 가능한 탭으로 복원한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{ id: "ungrouped", name: "Ungrouped", activeTabId: "tab-1", tabs: [{ id: "tab-1" }] }],
  });
  const editor = page.locator("textarea");
  await expect(editor).toHaveValue("");
  await expect(page.locator(".tab-title")).toHaveText("Untitled");
  await expect(page.locator(".tab-item")).not.toHaveClass(/is-pinned|is-bookmarked/);
  await editor.fill("Editable after recovery");
  await expect(editor).toHaveValue("Editable after recovery");
  const tab = (await readStoredState(page)).groups[0].tabs[0];
  expect(tab).toMatchObject({
    title: "Editable after recovery",
    content: "Editable after recovery",
    pinned: false,
    bookmarked: false,
  });
});
