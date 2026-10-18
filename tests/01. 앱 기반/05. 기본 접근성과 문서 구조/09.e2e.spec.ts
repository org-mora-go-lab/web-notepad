import { expect, test } from "@playwright/test";

test("9. 카카오 로그인 진입점과 안전한 OAuth 인가 요청을 제공한다", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.locator(".additional-tools-trigger").click();
  await expect(page.getByRole("link", { name: "Continue with Kakao" })).toHaveAttribute(
    "href",
    "/api/auth/oauth/kakao",
  );

  const response = await request.get("/api/auth/oauth/kakao", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  const location = new URL(response.headers().location);
  expect(location.origin).toBe("https://kauth.kakao.com");
  expect(location.pathname).toBe("/oauth/authorize");
  expect(location.searchParams.get("response_type")).toBe("code");
  expect(location.searchParams.get("client_id")).toBe("test-rest-key");
  expect(location.searchParams.get("redirect_uri")).toBe(
    "http://localhost:3100/api/auth/oauth/kakao/callback",
  );
  expect(location.searchParams.get("state")).toBeTruthy();
  expect(response.headers()["set-cookie"]).toContain("web-notepad-kakao-state=");
});
