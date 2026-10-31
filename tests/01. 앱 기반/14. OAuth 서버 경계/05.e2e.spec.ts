import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("5. OAuth를 다시 시작하면 이전과 다른 state를 발급한다", async ({
  request,
}) => {
  // Given: 동일 브라우저가 인증을 연속 두 번 시작한다.
  // When: 두 리다이렉트의 state를 비교한다.
  // Then: 각 요청에 독립적인 상태값을 발급해 재사용을 막는다.
  const first = await oauthStart(request);
  const second = await oauthStart(request);
  const firstState = new URL(first.headers().location).searchParams.get(
    "state",
  );
  const secondState = new URL(second.headers().location).searchParams.get(
    "state",
  );

  expect(first.status()).toBe(307);
  expect(second.status()).toBe(307);
  expect(firstState).toMatch(/^[\w-]{43}$/);
  expect(secondState).toMatch(/^[\w-]{43}$/);
  expect(secondState).not.toBe(firstState);
});
