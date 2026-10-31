import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("2. OAuth 인증 URL은 code 응답과 설정된 REST API 키를 사용한다", async ({
  request,
}) => {
  // Given: 카카오 OAuth 설정에 REST 키가 구성되어 있다.
  // When: 로그인 시작 URL을 생성한다.
  // Then: authorization code 방식과 지정된 client_id를 사용한다.
  const response = await oauthStart(request);
  const location = new URL(response.headers().location);
  const query = location.searchParams;

  expect(response.status()).toBe(307);
  expect(query.get("response_type")).toBe("code");
  expect(query.get("client_id")).toBe("test-rest-key");
  expect(query.has("client_secret")).toBe(false);
  expect(query.has("token")).toBe(false);
});
