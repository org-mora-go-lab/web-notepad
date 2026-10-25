import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("1. 더보기의 게시판은 공유 그룹을 표시하고 방문자에게 관리 버튼을 노출하지 않는다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(boardPost.title);
  await expect(page.locator(".board-card")).toHaveCount(1);
  await expect(page.locator(".board-card")).toContainText(boardPost.groupName);
  await expect(
    page.getByRole("button", { name: "Publish a group" }),
  ).toHaveCount(0);
});
