import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../../__util__";
import { expectRestoredBookmark } from "./__util__";

test("2. 기존 블루 북마크를 레드로 복원한다", async ({ page }) => {
  await restoreStoredBookmark(page, {
    tabColor: "blue",
    selectedLines: [],
  });
  await expectRestoredBookmark(page, { tabColor: "red", pressedLines: [false, false, false] });
});
