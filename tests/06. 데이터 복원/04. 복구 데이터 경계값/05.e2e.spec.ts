import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("5. 지원하지 않는 글자 배율은 90%로 복구한다", async ({ page }) => {
  await test.step(
    "시나리오: 5. 지원하지 않는 글자 배율은 90%로 복구한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 지원하지 않는 글자 배율은 90%로 복구한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedStoredStateOnLoad(page, { settings: { fontScale: 9 } });
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 지원하지 않는 글자 배율은 90%로 복구한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".home")).toHaveCSS("--font-scale", "0.9");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
