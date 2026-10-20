import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("3. 문자열이 아닌 북마크 제목과 내용은 안전한 표시값으로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    bookmarks: [{ id: "b1", sourceTabId: "gone", title: {}, content: 42 }],
  });
  expect((await readActiveGroup(page)).bookmarks[0]).toMatchObject({
    title: "Untitled",
    content: "",
  });
});
