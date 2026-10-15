import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../../__util__";
import { expectRestoredBookmark } from "./__util__";

test("6. 북마크 선택 줄의 중복·범위 초과·잘못된 인덱스를 제거한다", async ({ page }) => {
  await restoreStoredBookmark(page, {
    tabColor: "green",
    selectedLines: [2, 1, 1, -1, 3, 0.5, "0"],
  });
  await expectRestoredBookmark(page, { tabColor: "green", pressedLines: [false, true, true] });
});
