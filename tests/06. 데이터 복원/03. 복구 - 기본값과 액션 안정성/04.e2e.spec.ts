import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, seedStoredStateOnLoad } from "../../__util__";

test("4. 누락된 기본 그룹의 복구 탭 ID는 기존 탭과 북마크 원본 ID를 재사용하지 않는다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "work",
    nextTabNumber: 1,
    groups: [createGroupFixture("work", "Work", [createTabFixture("tab-1", "Work note")], {
      bookmarks: [2, 3].map((number) => ({
        id: `bookmark-${number}`,
        sourceTabId: `tab-${number}`,
        title: `Archived ${number}`,
        content: `Archived ${number}`,
        tabColor: "green",
        selectedLines: [],
        createdAt: 1,
        updatedAt: 1,
      })),
    })],
  });
  await page.waitForFunction(() => {
    const stored = localStorage.getItem("web-notepad-storage");
    if (!stored) return false;
    const state = JSON.parse(stored).state;
    return state.groups?.some((group: { id?: string }) => group.id === "ungrouped");
  });
  const state = await readStoredState(page);
  const recovered = state.groups.find((group) => group.id === "ungrouped")?.tabs[0];
  expect(recovered).toBeDefined();
  expect(["tab-1", "tab-2", "tab-3"]).not.toContain(recovered!.id);
});
