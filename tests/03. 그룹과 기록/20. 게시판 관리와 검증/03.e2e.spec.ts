import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";

test("3. 일반 방문자는 관리 API로 게시글을 등록하거나 수정하거나 내릴 수 없다", async ({
  request,
  boardPost,
}) => {
  for (const method of ["POST", "PATCH", "DELETE"]) {
    const response = await request.fetch("/api/board", {
      method,
      data: {
        id: boardPost.id,
        title: "Unauthorized",
        description: "Forbidden",
        inviteUrl: boardPost.inviteUrl,
      },
    });
    expect(response.status()).toBe(403);
  }
  const { posts } = await (await request.get("/api/board")).json();
  expect(posts.find((p: { id: string }) => p.id === boardPost.id).title).toBe(
    boardPost.title,
  );
});
