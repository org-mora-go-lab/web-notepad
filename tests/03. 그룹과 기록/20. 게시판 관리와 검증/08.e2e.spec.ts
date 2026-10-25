import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { selectBoardPost } from "../../__util__";

test("8. 관리자는 유효한 공유 링크로 새 게시글을 등록하고 새로고침 후 확인한다", async ({
  page,
  request,
  boardPost,
}) => {
  await request.delete("/api/board?role=admin", { data: { id: boardPost.id } });
  await page.goto("/?role=admin");
  await page
    .getByRole("button", { name: "Publish a group", exact: true })
    .click();
  await page
    .getByLabel("Group invitation link", { exact: true })
    .fill(boardPost.inviteUrl);
  await page.getByLabel("Post title", { exact: true }).fill(boardPost.title);
  await page
    .getByLabel("Description", { exact: true })
    .fill("Published through the form");
  await page.getByRole("button", { name: "Save post", exact: true }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search shared groups" }),
  ).toBeVisible();
  await page.reload();
  await selectBoardPost(page, boardPost.title);
  await expect(page.locator(".board-description")).toHaveText(
    "Published through the form",
  );
  const { posts } = await (await request.get("/api/board")).json();
  const replacement = posts.find(
    (p: { title: string }) => p.title === boardPost.title,
  );
  await request.delete("/api/board?role=admin", {
    data: { id: replacement.id },
  });
});
