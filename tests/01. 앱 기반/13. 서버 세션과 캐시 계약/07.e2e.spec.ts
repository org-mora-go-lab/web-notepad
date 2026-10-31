import { expect, test } from "@playwright/test";

import { authenticate, getApi } from "../../__util__";

test("7. role 쿼리로 세션 권한을 추가할 수 없다", async ({ page, context }) => {
  await test.step(
    "시나리오: 7. role 쿼리로 세션 권한을 추가할 수 없다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 7. role 쿼리로 세션 권한을 추가할 수 없다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await authenticate(context, "query-role-user");
        },
        { box: true },
      );

      const response = await getApi(
        page.request,
        "/api/auth/session?role=admin",
      );

      const payload = await response.json();

      await test.step(
        "검증 1: 7. role 쿼리로 세션 권한을 추가할 수 없다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.status()).toBe(200);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 7. role 쿼리로 세션 권한을 추가할 수 없다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(payload.user.id).toBe("query-role-user");
        },
        { box: true },
      );

      await test.step(
        "검증 3: 7. role 쿼리로 세션 권한을 추가할 수 없다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(payload.user).not.toHaveProperty("role");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
