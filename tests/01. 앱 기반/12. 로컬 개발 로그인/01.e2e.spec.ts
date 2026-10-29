import { expect, test } from "@playwright/test";

import {
  readSession,
  SESSION_COOKIE,
} from "../../../app/api/auth/_lib/session";
import { GET } from "../../../app/api/auth/oauth/kakao/route";

function readUser(response: Response) {
  const cookie = response.headers
    .get("x-middleware-set-cookie")
    ?.split(",web-notepad-kakao-state=")[0];
  const value = cookie?.split(";")[0].slice(`${SESSION_COOKIE}=`.length);
  return { cookie, user: readSession(value) };
}

test("1. localhost에서 로그인할 때마다 순번이 증가한 별도 테스트 사용자가 된다", async () => {
  const previousFlag = process.env.LOCAL_DEV_LOGIN;
  const previousSecret = process.env.AUTH_SECRET;
  process.env.LOCAL_DEV_LOGIN = "1";
  process.env.AUTH_SECRET = "test-auth-secret";
  let firstLoginResponse: Response;
  let secondLoginResponse: Response;
  let first: ReturnType<typeof readUser>;
  let second: ReturnType<typeof readUser>;
  try {
    firstLoginResponse = await GET(
      new Request("http://localhost:3000/api/auth/oauth/kakao"),
    );
    secondLoginResponse = await GET(
      new Request("http://localhost:3000/api/auth/oauth/kakao"),
    );
    first = readUser(firstLoginResponse);
    second = readUser(secondLoginResponse);
  } finally {
    if (previousFlag === undefined) delete process.env.LOCAL_DEV_LOGIN;
    else process.env.LOCAL_DEV_LOGIN = previousFlag;
    if (previousSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = previousSecret;
  }

  expect(firstLoginResponse.status).toBe(307);
  expect(secondLoginResponse.status).toBe(307);
  expect(first.cookie).toContain(`${SESSION_COOKIE}=`);
  expect(second.cookie).toContain(`${SESSION_COOKIE}=`);
  expect(first.user?.nickname).toMatch(/^Test \d+$/);
  const firstSequence = Number(first.user?.nickname.replace("Test ", ""));
  expect(second.user).toEqual({
    id: `local-test-user-${firstSequence + 1}`,
    nickname: `Test ${firstSequence + 1}`,
    profileImageUrl: "/test-user.svg",
  });
});
