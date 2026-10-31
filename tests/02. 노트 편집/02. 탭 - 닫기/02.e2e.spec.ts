import { expect, test } from "@playwright/test";

import { createPinnedAndBookmarkedTabs } from "../../__util__";

test("2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const { pinnedTab: tab } = await createPinnedAndBookmarkedTabs(page);

      await test.step(
        "검증 1: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(tab).not.toHaveClass(/is-pinned/);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(tab.locator(".tab-pin-indicator")).toHaveCount(0);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(tab.locator(".tab-close")).toBeVisible();
        },
        { box: true },
      );

      await test.step(
        "실행 1: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await tab.locator(".tab-close").click();
        },
        { box: true },
      );

      await test.step(
        "검증 4: 2. 이전에 고정한 탭도 핀 표시 없이 일반 닫기 버튼으로 닫는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(tab).toHaveCount(0);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
