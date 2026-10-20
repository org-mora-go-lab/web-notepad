import { expect, test } from "@playwright/test";

test("1. 인증을 다시 시작하면 이전과 다른 상태값을 발급한다", async ({
  request,
}) => {
  const first = await request.get("/api/auth/oauth/kakao", { maxRedirects: 0 });
  const second = await request.get("/api/auth/oauth/kakao", {
    maxRedirects: 0,
  });
  const state = (response: typeof first) =>
    new URL(response.headers().location).searchParams.get("state");
  expect(state(first)).toMatch(/^[A-Za-z0-9_-]{40,}$/);
  expect(state(second)).not.toBe(state(first));
});
