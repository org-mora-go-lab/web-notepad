import { expect } from "@playwright/test";

import { boardTest as test, signedSession } from "../../__fixture__";
import { authenticateBrowser, selectBoardPost } from "../../__util__";

test("2. 게시글 내리기는 취소할 수 있고 내린 뒤에도 원본 그룹 초대는 유효하다", async ({
  page,
  context,
  boardPost,
}) => {
  await page.goto("/?role=admin");
  await selectBoardPost(page, boardPost.title);
  await page.getByRole("button", { name: "Remove post", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".board-detail h3")).toHaveText(boardPost.title);
  await page.getByRole("button", { name: "Remove post", exact: true }).click();
  await page
    .getByRole("group", { name: "Remove post" })
    .getByRole("button", { name: "Remove post", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(boardPost.title);
  await expect(page.getByText("No matching groups")).toBeVisible();
  await authenticateBrowser(
    context,
    signedSession({
      id: crypto.randomUUID(),
      nickname: "Still invited",
      expiresAt: Date.now() + 300000,
    }),
  );
  await page.goto(boardPost.inviteUrl);
  await expect(
    page.getByText("Shared group added. You can edit it now."),
  ).toBeVisible();
});
