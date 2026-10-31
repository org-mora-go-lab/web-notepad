import { expect, test } from "@playwright/test";

test("10. 로그아웃은 OAuth 상태만 지우고 무관한 쿠키는 유지한다", async ({
  page,
  context,
}) => {
  // Given: OAuth 상태 쿠키와 무관한 사용자 쿠키가 함께 존재한다.
  // When: 로그아웃을 수행한다.
  // Then: 인증 상태만 지우고 무관한 쿠키는 보존한다.
  await context.addCookies([
    { name: "unrelated", value: "keep", url: "http://localhost:3000" },
    {
      name: "web-notepad-kakao-state",
      value: "pending",
      url: "http://localhost:3000",
    },
  ]);
  const response = await page.request.post("/api/auth/logout");
  const cookies = await context.cookies("http://localhost:3000");

  expect(response.status()).toBe(200);
  expect(cookies.find((cookie) => cookie.name === "unrelated")?.value).toBe(
    "keep",
  );
  expect(
    cookies.some((cookie) => cookie.name === "web-notepad-kakao-state"),
  ).toBe(false);
});
