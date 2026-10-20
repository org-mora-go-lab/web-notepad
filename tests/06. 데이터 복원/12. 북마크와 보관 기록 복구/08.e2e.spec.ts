import { expect, test } from "@playwright/test";

import { createClosedTabFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, restoreWorkspace } from "../../__util__";

test("8. 보관된 탭은 잘못 저장된 열림과 고정 상태를 해제한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      closedTabs: [
        createClosedTabFixture(
          "c1",
          "ungrouped",
          createTabFixture("archived", "Archived", {
            open: true,
            pinned: true,
          }),
        ),
      ],
    },
  );
  expect((await readStoredState(page)).closedTabs?.[0].tab).toMatchObject({
    open: false,
    pinned: false,
    content: "Archived",
  });
});
