import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("5. 전체 그룹의 잘못된 활성 분할은 기본 분할로 복구한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. 전체 그룹의 잘못된 활성 분할은 기본 분할로 복구한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 전체 그룹의 잘못된 활성 분할은 기본 분할로 복구한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreWorkspace(
            page,
            {},
            {
              allGroupLayout: { activePane: "unknown", rightTabIds: ["tab-2"] },
            },
          );
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 전체 그룹의 잘못된 활성 분할은 기본 분할로 복구한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect((await readStoredState(page)).allGroupLayout?.activePane).toBe(
            "left",
          );
        },
        { box: true },
      );
    },
    { box: true },
  );
});
