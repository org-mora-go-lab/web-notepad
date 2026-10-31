import { expect, test } from "@playwright/test";

import { paneSlot, seedQuadState } from "../__util__";

test("4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedQuadState(page);
        },
        { box: true },
      );

      await test.step(
        "검증 1: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".pane-slot")).toHaveCount(4);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await paneSlot(page, "left-bottom")
            .getByRole("button", { name: "Close left-bottom" })
            .click();
        },
        { box: true },
      );

      await test.step(
        "검증 2: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".pane-slot")).toHaveCount(3);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(paneSlot(page, "left-bottom")).toHaveCount(0);
        },
        { box: true },
      );

      await test.step(
        "검증 4: 4. 하단 패널의 마지막 탭을 닫으면 해당 열의 상하 분할을 해제한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page.locator('.pane-column[data-column="left"] .pane-slot'),
          ).toHaveCount(1);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
