import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import {
  bookmarksCommand,
  readStoredState,
  seedStoredStateOnLoad,
  switchGroup,
} from "../__util__";

test("11. 빈 그룹 복구 탭은 다른 그룹 북마크의 원본 ID를 재사용하지 않는다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    nextTabNumber: 2,
    groups: [
      { id: "ungrouped", name: "Ungrouped", tabs: [] },
      createGroupFixture(
        "work",
        "Work",
        [createTabFixture("tab-1", "Work note")],
        {
          bookmarks: [2, 3].map((number) => ({
            id: `bookmark-${number}`,
            sourceTabId: `tab-${number}`,
            title: `Archived note ${number}`,
            content: `Archived note ${number}`,
            tabColor: "green",
            selectedLines: [],
            createdAt: 1,
            updatedAt: 1,
          })),
        },
      ),
    ],
  });
  await expect(page.locator("textarea")).toHaveValue("");
  await page.locator("textarea").fill("Recovered workspace");
  await expect
    .poll(async () => {
      const tab = (await readStoredState(page)).groups.find(
        (group) => group.id === "ungrouped",
      )?.tabs[0];
      return (
        tab?.content === "Recovered workspace" &&
        !["tab-2", "tab-3"].includes(tab.id)
      );
    })
    .toBe(true);
  await switchGroup(page, "Work");
  await bookmarksCommand(page).click();
  await page
    .locator(".bookmark-item")
    .first()
    .getByRole("button", { name: "Open", exact: true })
    .click();
  await expect(page.locator("textarea")).toHaveValue("Archived note 2");
  await switchGroup(page, "All Group");
  await expect(page.locator(".tab-item")).toHaveCount(3);
  const state = await readStoredState(page);
  const tabs = state.groups.flatMap((group) => group.tabs);
  expect(new Set(tabs.map((tab) => tab.id)).size).toBe(tabs.length);
  await page
    .getByRole("tab", { name: "Recovered workspace", exact: true })
    .click();
  await expect(page.locator("textarea")).toHaveValue("Recovered workspace");
});
