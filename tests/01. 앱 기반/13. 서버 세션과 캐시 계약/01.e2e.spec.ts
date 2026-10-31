import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__";

test("1. 익명 세션 조회는 user null과 200을 반환한다", async ({ request }) => {
  await test.step(
    "시나리오: 1. 익명 세션 조회는 user null과 200을 반환한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const response = await getApi(request, "/api/auth/session");

      const payload = await response.json();

      await test.step(
        "검증 1: 1. 익명 세션 조회는 user null과 200을 반환한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.status()).toBe(200);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 1. 익명 세션 조회는 user null과 200을 반환한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.ok()).toBe(true);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 1. 익명 세션 조회는 user null과 200을 반환한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(response.headers()["cache-control"]).toBe("private, no-store");
        },
        { box: true },
      );

      await test.step(
        "검증 4: 1. 익명 세션 조회는 user null과 200을 반환한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(payload).toEqual({ user: null });
        },
        { box: true },
      );

      await test.step(
        "검증 5: 1. 익명 세션 조회는 user null과 200을 반환한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(payload).not.toHaveProperty("error");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
