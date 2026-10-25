import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";

test("5. 같은 공유 그룹의 중복 등록을 거부하고 기존 글을 유지한다", async ({
  request,
  boardPost,
}) => {
  const response = await request.post("/api/board?role=admin", {
    data: {
      inviteUrl: boardPost.inviteUrl,
      title: "Duplicate",
      description: "Duplicate post",
    },
  });
  expect(response.status()).toBe(409);
  const { posts } = await (await request.get("/api/board")).json();
  expect(
    posts.filter((p: { id: string }) => p.id === boardPost.id),
  ).toHaveLength(1);
});
