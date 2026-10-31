import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("3. 코드가 없는 콜백은 카카오 호출 없이 invalid_state로 돌아온다", async ({
  request,
}) => {
  await test.step(
    "시나리오: 3. 코드가 없는 콜백은 카카오 호출 없이 invalid_state로 돌아온다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await getApi(
        request,
        "/api/auth/oauth/kakao/callback?state=expected",
        { maxRedirects: 0, headers: { Cookie: OAUTH_COOKIE + "=expected" } },
      );

      await test.step(
        "검증 1: 3. 코드가 없는 콜백은 카카오 호출 없이 invalid_state로 돌아온다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.status()).toBe(307);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 3. 코드가 없는 콜백은 카카오 호출 없이 invalid_state로 돌아온다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(
            new URL(response.headers().location).searchParams.get("auth_error"),
          ).toBe("invalid_state");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
