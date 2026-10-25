import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("8. 초대 링크 복사는 관리자 파라미터 없이 참여 링크만 복사한다", async ({
  page,
  context,
  boardPost,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  await page.getByRole("button", { name: "Copy invitation link" }).click();
  await expect(
    page.getByRole("button", { name: "Invitation link copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    boardPost.inviteUrl,
  );
  expect(new URL(boardPost.inviteUrl).searchParams.has("role")).toBe(false);
});
