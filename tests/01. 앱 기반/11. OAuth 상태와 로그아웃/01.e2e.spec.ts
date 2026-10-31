import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__/request";

test("1. 인증을 다시 시작하면 이전과 다른 상태값을 발급한다", async ({
  request,
}) => {
  await test.step(
    "시나리오: 1. 인증을 다시 시작하면 이전과 다른 상태값을 발급한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const first = await getApi(request, "/api/auth/oauth/kakao", {
        maxRedirects: 0,
      });

      const second = await getApi(request, "/api/auth/oauth/kakao", {
        maxRedirects: 0,
      });

      const state = (response: typeof first) =>
        new URL(response.headers().location).searchParams.get("state");

      await test.step(
        "검증 1: 1. 인증을 다시 시작하면 이전과 다른 상태값을 발급한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(state(first)).toMatch(/^[A-Za-z0-9_-]{40,}$/);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 1. 인증을 다시 시작하면 이전과 다른 상태값을 발급한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(state(second)).not.toBe(state(first));
        },
        { box: true },
      );
    },
    { box: true },
  );
});
