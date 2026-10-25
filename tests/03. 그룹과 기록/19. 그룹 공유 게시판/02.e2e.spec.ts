import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("2. 게시글 상세는 소개와 참여 링크를 제공하고 클릭만으로 그룹을 추가하지 않는다", async ({
  page,
  request,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  await expect(page.locator(".board-description")).toHaveText(
    boardPost.description,
  );
  await expect(
    page.getByRole("link", { name: "Join this group" }),
  ).toHaveAttribute("href", boardPost.inviteUrl);
  expect(await (await request.get("/api/board")).text()).not.toContain(
    "Private shared note body",
  );
  await expect(page.locator("textarea.note-area")).toHaveValue("");
});
