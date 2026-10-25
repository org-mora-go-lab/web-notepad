import { expect, test } from "@playwright/test";

test("3. 비로그인 사용자는 이력을 조회하거나 저장할 수 없다", async ({ request }) => {
  const read = await request.get("/api/notepad/history");
  expect(read.status()).toBe(401);
  const write = await request.post("/api/notepad/history", {
    data: { eventId: crypto.randomUUID(), snapshot: "{}" },
  });
  expect(write.status()).toBe(401);
});
