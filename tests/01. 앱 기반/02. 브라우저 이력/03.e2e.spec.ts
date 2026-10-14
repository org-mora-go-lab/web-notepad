import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("3. 분할 화면의 활성 pane과 실제 편집기 포커스를 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  const group = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [createTabFixture("left-tab", "Left note"), createTabFixture("right-tab", "Right note")],
    {
      rightTabIds: ["right-tab"],
      activeRightTabId: "right-tab",
      activePane: "left",
    },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 3,
  });

  const leftEditor = page.locator('.pane-slot[data-pane="left"] textarea');
  const rightEditor = page.locator('.pane-slot[data-pane="right"] textarea');
  await leftEditor.click();
  await expect(leftEditor).toBeFocused();
  await rightEditor.click();
  await expect(rightEditor).toBeFocused();
  await expect.poll(() => new URL(page.url()).searchParams.get("pane")).toBe("right");

  await page.goBack();
  await expect(leftEditor).toBeFocused();
  await expect(page.locator('[data-pane="left"] .note-pane')).not.toHaveClass(/is-unfocused/);
  await page.goForward();
  await expect(rightEditor).toBeFocused();
  await expect(page.locator('[data-pane="right"] .note-pane')).not.toHaveClass(/is-unfocused/);
});
