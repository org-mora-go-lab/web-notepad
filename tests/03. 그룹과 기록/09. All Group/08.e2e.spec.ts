import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import {
  readStoredState,
  seedStoredStateOnLoad,
  switchGroup,
} from "../../__util__";

test("8. 다른 그룹에 빈 탭이 있어도 All Group의 새 메모는 Ungrouped에 저장한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Existing ungrouped note"),
      ]),
      createGroupFixture("project", "Project", [createTabFixture("tab-2", "")]),
    ],
    activeGroupId: "ungrouped",
  });
  await switchGroup(page, "All Group");
  await expect(page.getByRole("tab")).toHaveCount(2);
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await page.locator("textarea").fill("New note belongs to Ungrouped");
  const state = await readStoredState(page);
  expect(
    state.groups
      .find((group) => group.id === "ungrouped")
      ?.tabs.some((tab) => tab.content === "New note belongs to Ungrouped"),
  ).toBe(true);
  expect(
    state.groups
      .find((group) => group.id === "project")
      ?.tabs.map((tab) => tab.content),
  ).toEqual([""]);
});
