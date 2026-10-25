import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";

test("6. 잘못된 초대 링크나 빈 제목과 초과 길이 소개는 저장하지 않는다", async ({
  request,
  boardPost,
}) => {
  for (const patch of [
    { inviteUrl: "javascript:alert(1)" },
    { inviteUrl: "http://localhost:3100/?share=invalid" },
    { title: "  " },
    { description: "x".repeat(1001) },
  ]) {
    const response = await request.post("/api/board?role=admin", {
      data: {
        inviteUrl: boardPost.inviteUrl,
        title: "Invalid",
        description: "Example",
        ...patch,
      },
    });
    expect(response.status()).toBe(400);
  }
});
