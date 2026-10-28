import { expect, test } from "@playwright/test";

test("8. 카카오 로그인 진입점과 안전한 OAuth 인가 요청을 제공한다", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".footer").getByRole("link", { name: "Continue with Kakao" }),
  ).toHaveAttribute("href", "/api/auth/oauth/kakao");

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
  expect(response.headers()["set-cookie"]).toContain(
    "web-notepad-kakao-state=",
  );

  await page.route("**/api/auth/session", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: "kakao-user",
          nickname: "Mora",
          profileImageUrl: "https://example.com/profile.png",
        },
      }),
    }),
  );
  await page.reload();
  const profile = page.locator(".footer .auth-command", { hasText: "Mora" });
  await expect(profile).toBeVisible();
  await expect(profile.locator("img")).toHaveAttribute(
    "src",
    "https://example.com/profile.png",
  );
});
