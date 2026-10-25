import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  await page.getByRole("link", { name: "Join this group" }).click();
  await expect(
    page.getByRole("link", { name: "Continue with Kakao" }).last(),
  ).toBeVisible();
  await expect(page).toHaveURL(/share=/);
});
