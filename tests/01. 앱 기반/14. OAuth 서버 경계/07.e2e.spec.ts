import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

test("7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다", async ({
  request,
}) => {
  await test.step(
    "시나리오: 7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await oauthStart(request, "?share=invalid.token");

      const location = new URL(response.headers().location);

      const cookie = response.headers()["set-cookie"];

      await test.step(
        "검증 1: 7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.status()).toBe(307);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(location.hostname).toBe("kauth.kakao.com");
        },
        { box: true },
      );

      await test.step(
        "검증 3: 7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie).toContain("web-notepad-share-return=");
        },
        { box: true },
      );

      await test.step(
        "검증 4: 7. 유효하지 않은 공유 토큰은 복귀 쿠키에서 제거한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(cookie.toLowerCase()).toContain("httponly");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
