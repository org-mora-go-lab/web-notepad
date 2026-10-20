import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("9. 보관된 노트도 색상과 줄 선택을 정규화하면서 내용은 보존한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    {
      closedTabs: [
        {
          id: "c1",
          groupId: "ungrouped",
          closedAt: 1,
          tab: {
            id: "archived",
            content: "one\ntwo",
            tabColor: "invalid",
            selectedLines: [1, 1, 9, -1],
          },
        },
      ],
    },
  );
  expect((await readStoredState(page)).closedTabs?.[0].tab).toMatchObject({
    content: "one\ntwo",
    tabColor: "green",
    selectedLines: [1],
  });
});
