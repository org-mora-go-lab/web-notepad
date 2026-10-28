import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("9. 보드 목록의 Group 셀에는 우측 화살표를 표시하지 않는다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);

  const entry = page.locator(`.board-entry[data-group-id="${boardPost.id}"]`);
  await expect(entry).toBeVisible();
  await expect(entry.locator("svg.lucide-layers")).toHaveCount(1);
  await expect(entry.locator("svg.lucide-arrow-up-right")).toHaveCount(0);
  await expect(entry.locator("svg")).toHaveCount(1);
});
