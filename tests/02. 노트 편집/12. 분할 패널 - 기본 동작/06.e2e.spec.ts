import { expect, test } from "@playwright/test";

import { dividerDistanceFromCenter } from "../../__util__";
import { seedSplitState } from "../__util__";

test("6. 앱 재접속 시 분할 비율을 중앙으로 초기화한다", async ({ page }) => {
  await test.step(
    "시나리오: 6. 앱 재접속 시 분할 비율을 중앙으로 초기화한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 6. 앱 재접속 시 분할 비율을 중앙으로 초기화한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSplitState(page, 0.7);
        },
        { box: true },
      );

      await test.step(
        "검증 1: 6. 앱 재접속 시 분할 비율을 중앙으로 초기화한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect
            .poll(() => dividerDistanceFromCenter(page))
            .toBeLessThan(10);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
