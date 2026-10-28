path_helper: node.save: Permission denied
import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";
import { getApi } from "../../__util__/request";

test("2. 게시글 상세는 소개와 참여 링크를 제공하고 클릭만으로 그룹을 추가하지 않는다", async ({
  page,
  request,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  await expect(page.locator(".board-detail .board-owner")).toHaveText(
    "Board owner",
  );
  await expect(page.locator(".board-detail .board-owner svg")).toHaveCount(1);
  await expect(page.locator(".board-description")).toHaveText(
    "A shared workspace. Join to write together.",
  );
  await expect(
    page.getByRole("link", { name: "Join this group" }),
  ).toHaveAttribute("href", boardPost.inviteUrl);
  expect(await (await getApi(request, "/api/board")).text()).not.toContain(
    "Private shared note body",
  );
  await page
    .getByRole("button", { name: "Back to groups", exact: true })
    .click();
  await expect(page.locator(".board-list")).toBeVisible();
});
