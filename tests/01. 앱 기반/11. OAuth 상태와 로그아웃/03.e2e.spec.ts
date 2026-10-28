import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("3. 코드가 없는 콜백은 카카오 호출 없이 invalid_state로 돌아온다", async ({
  request,
}) => {
  const response = await getApi(
    request,
    "/api/auth/oauth/kakao/callback?state=expected",
    { maxRedirects: 0, headers: { Cookie: OAUTH_COOKIE + "=expected" } },
  );
  expect(response.status()).toBe(307);
  expect(
    new URL(response.headers().location).searchParams.get("auth_error"),
  ).toBe("invalid_state");
});
