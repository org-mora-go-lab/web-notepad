import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, writeStoredState } from "../../__util__";

test("3. 이전 색상 주기를 옮겨도 기존 To Do Doing Done 상태와 본문을 보존한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    settings: { tabColorCycle: ["red", "purple", "pink"] },
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("a", "To Do body", { tabColor: "red" }),
        createTabFixture("b", "Doing body", { tabColor: "purple" }),
        createTabFixture("c", "Done body", { tabColor: "pink" }),
      ]),
    ],
  });
  const initial = await readStoredState(page);
  expect(initial.settings!.tabColorCycle).toEqual(["red", "orange", "purple"]);
  expect(initial.groups[0].tabs.map((tab) => tab.dashboardStatus)).toEqual([
    "todo",
    "in-progress",
    "done",
  ]);
  await page.reload();
  const restored = await readStoredState(page);
  expect(restored.groups[0].tabs).toEqual(initial.groups[0].tabs);
  expect(restored.settings).toEqual(initial.settings);
});
