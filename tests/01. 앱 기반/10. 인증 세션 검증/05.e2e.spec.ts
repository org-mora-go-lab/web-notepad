import { expect, test } from "@playwright/test";

import { sessionHeaders } from "../../__util__";
import { getApi } from "../../__util__/request";

test("5. 서명 구분자가 없는 세션을 안전하게 거부한다", async ({ request }) => {
  await test.step(
    "시나리오: 5. 서명 구분자가 없는 세션을 안전하게 거부한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await getApi(request, "/api/auth/session", {
        headers: sessionHeaders("incomplete"),
      });

      await test.step(
        "검증 1: 5. 서명 구분자가 없는 세션을 안전하게 거부한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.ok()).toBe(true);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 서명 구분자가 없는 세션을 안전하게 거부한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(await response.json()).toEqual({ user: null });
        },
        { box: true },
      );
    },
    { box: true },
  );
});
