import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("5. 북마크 수정 시간이 손상되면 유효한 생성 시간을 사용한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    bookmarks: [
      {
        ...createBookmarkFixture("b1", "gone", "Dated"),
        createdAt: 1234,
        updatedAt: "broken",
      },
    ],
  });
  expect((await readActiveGroup(page)).bookmarks[0]).toMatchObject({
    createdAt: 1234,
    updatedAt: 1234,
  });
});
