import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("7. 게시판 요청 실패 후 다시 시도로 목록을 복구한다", async ({
  page,
  boardPost,
}) => {
  await page.route("**/api/board", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.goto("/");
  await openBoard(page);
  await expect(page.locator("#board-page").getByRole("alert")).toContainText(
    "Could not load the board",
  );
  await page.unroute("**/api/board");
  await page.getByRole("button", { name: "Try again" }).click();
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(boardPost.title);
  await expect(page.locator(".board-entry")).toHaveCount(1);
});
