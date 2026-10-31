import { expect, test } from "@playwright/test";

import { seedSplitState } from "../__util__";

test("5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSplitState(page);
        },
        { box: true },
      );

      const leftPane = page.locator('.pane-slot[data-pane="left"]');

      const rightPane = page.locator('.pane-slot[data-pane="right"]');

      await test.step(
        "실행 2: 5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await rightPane
            .locator(".tab-item")
            .dragTo(leftPane.locator(".header"));
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".pane-slot")).toHaveCount(1);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 오른쪽 패널의 마지막 탭을 왼쪽으로 옮기면 분할 화면을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".tab-title")).toHaveText([
            /^left$/i,
            /^right$/i,
          ]);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
