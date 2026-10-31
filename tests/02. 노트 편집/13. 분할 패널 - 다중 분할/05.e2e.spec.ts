import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedQuadState } from "../__util__";

test("5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedQuadState(page);
        },
        { box: true },
      );

      const rightTopTab = paneSlot(page, "right").locator(".tab-item");

      await test.step(
        "실행 2: 5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await dragTabToZone(
            page,
            rightTopTab,
            paneSlot(page, "left"),
            "Move here",
          );
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(paneSlot(page, "right").locator("textarea")).toHaveValue(
            "right-bottom",
          );
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 상단 패널이 비면 같은 열의 하단 패널을 상단으로 올린다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(paneSlot(page, "right-bottom")).toHaveCount(0);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
