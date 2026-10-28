import { expect, test } from "@playwright/test";

import { GET } from "../../../app/api/auth/oauth/kakao/route";

test("1. localhost 개발 환경에서 LOGIN을 누르면 샘플 이미지와 TEST 이름으로 로그인한다", async ({
  page,
}) => {
  const previousFlag = process.env.LOCAL_DEV_LOGIN;
  const previousSecret = process.env.AUTH_SECRET;
  process.env.LOCAL_DEV_LOGIN = "1";
  process.env.AUTH_SECRET = "test-auth-secret";
  let loginResponse: Response;
  try {
    loginResponse = await GET(
      new Request("http://localhost:3100/api/auth/oauth/kakao"),
    );
  } finally {
    if (previousFlag === undefined) delete process.env.LOCAL_DEV_LOGIN;
    else process.env.LOCAL_DEV_LOGIN = previousFlag;
    if (previousSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = previousSecret;
  }

  expect(loginResponse.status).toBe(307);
  const sessionCookie = loginResponse.headers
    .get("x-middleware-set-cookie")
    ?.split(",web-notepad-kakao-state=")[0];
  expect(sessionCookie).toContain("web-notepad-session=");
  await page.route("**/api/auth/oauth/kakao", (route) =>
    route.fulfill({
      status: loginResponse.status,
      headers: {
        location: loginResponse.headers.get("location")!,
        "set-cookie": sessionCookie!,
      },
      body: "",
    }),
  );

  await page.goto("/");
  await page.locator('a[href="/api/auth/oauth/kakao"]').click();
  const account = page.getByRole("button", { name: /^TEST ·/ });
  await expect(account).toBeVisible();
  const image = account.locator("img");
  await expect(image).toHaveAttribute("src", "/test-user.svg");
  await expect
    .poll(() =>
      image.evaluate((avatar: HTMLImageElement) => avatar.naturalWidth),
    )
    .toBeGreaterThan(0);
});
