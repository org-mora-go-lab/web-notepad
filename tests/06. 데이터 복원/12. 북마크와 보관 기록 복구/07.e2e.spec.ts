import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, restoreWorkspace } from "../../__util__";

test("7. 보관 기록의 필수 ID나 원본 탭이 없으면 해당 기록만 제외한다", async ({
  page,
}) => {
  const valid = createClosedTabFixture(
    "c1",
    "ungrouped",
    createTabFixture("archived", "Archived"),
  );
  await restoreWorkspace(
    page,
    {},
    {
      closedTabs: [
        null,
        {},
        { ...valid, groupId: null },
        { ...valid, tab: { content: "missing id" } },
        valid,
      ],
    },
  );
  expect(
    (await readStoredState(page)).closedTabs?.map((entry) => entry.id),
  ).toEqual(["c1"]);
});
