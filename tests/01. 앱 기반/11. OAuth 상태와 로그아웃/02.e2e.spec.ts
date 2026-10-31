import { expect, test } from "@playwright/test";

import { OAUTH_COOKIE } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다", async ({
  request,
}) => {
  await test.step(
    "시나리오: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await getApi(request, "/api/auth/oauth/kakao", {
        maxRedirects: 0,
      });

      const cookie = response.headers()["set-cookie"];

      await test.step(
        "검증 1: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toContain(OAUTH_COOKIE + "=");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toMatch(/HttpOnly/i);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toMatch(/SameSite=lax/i);
        },
        { box: true },
      );

      await test.step(
        "검증 4: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toMatch(/Max-Age=600/i);
        },
        { box: true },
      );

      await test.step(
        "검증 5: 2. OAuth 상태 쿠키는 짧은 수명과 스크립트 접근 차단을 적용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toMatch(/Path=\//);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
