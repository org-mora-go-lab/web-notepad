import { expect, test } from "@playwright/test";

import { hoverTabOverPane, paneSlot, seedSplitState } from "../__util__";

test("3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSplitState(page);
        },
        { box: true },
      );

      const target = paneSlot(page, "right");

      const release = await hoverTabOverPane(
        page,
        paneSlot(page, "left").locator(".tab-item"),
        target,
        0.5,
        0.75,
      );

      await test.step(
        "검증 1: 3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(target.locator(".note-pane-drop")).toHaveText([
            "Move here",
          ]);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 3. 마지막 탭을 다른 기존 패널로 옮길 때는 Move here만 표시한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await release();
        },
        { box: true },
      );
    },
    { box: true },
  );
});
