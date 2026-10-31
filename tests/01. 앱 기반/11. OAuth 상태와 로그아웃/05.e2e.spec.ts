import { expect, test } from "@playwright/test";

import { SESSION_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("5. 상태 쿠키 없이 직접 연 콜백은 세션을 만들지 않는다", async ({
  request,
}) => {
  await test.step(
    "시나리오: 5. 상태 쿠키 없이 직접 연 콜백은 세션을 만들지 않는다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await getApi(
        request,
        "/api/auth/oauth/kakao/callback?code=unused&state=expected",
        { maxRedirects: 0 },
      );

      await test.step(
        "검증 1: 5. 상태 쿠키 없이 직접 연 콜백은 세션을 만들지 않는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(
            new URL(response.headers().location).searchParams.get("auth_error"),
          ).toBe("invalid_state");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 상태 쿠키 없이 직접 연 콜백은 세션을 만들지 않는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.headers()["set-cookie"]).not.toContain(
            SESSION_COOKIE + "=",
          );
        },
        { box: true },
      );
    },
    { box: true },
  );
});
