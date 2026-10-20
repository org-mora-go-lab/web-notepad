import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("4. 북마크 줄 선택은 유효한 인덱스만 중복 없이 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    bookmarks: [
      createBookmarkFixture("b1", "gone", "one\ntwo\nthree", {
        selectedLines: [2, 0, 2, -1, 8, 1.5],
      }),
    ],
  });
  expect((await readActiveGroup(page)).bookmarks[0].selectedLines).toEqual([
    0, 2,
  ]);
});
