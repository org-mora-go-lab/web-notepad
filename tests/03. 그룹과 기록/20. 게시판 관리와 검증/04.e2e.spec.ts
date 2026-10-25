import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";

test("4. 관리 모드여도 다른 출처에서 보낸 변경 요청은 거부한다", async ({
  request,
  boardPost,
}) => {
  const response = await request.patch("/api/board?role=admin", {
    headers: { Origin: "https://untrusted.example" },
    data: { id: boardPost.id, title: "Changed", description: "No" },
  });
  expect(response.status()).toBe(403);
});
