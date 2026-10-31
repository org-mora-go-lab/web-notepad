import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 변경한 그룹 순서를 새로고침 후 복원한다", async ({ page }) => {
  await test.step(
    "시나리오: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSortableGroups(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await groupsCommand(page).click();
        },
        { box: true },
      );

      const handle = page.locator('[data-group-id="zulu"] .group-reorder');

      await test.step(
        "실행 3: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await handle.focus();
        },
        { box: true },
      );

      await test.step(
        "실행 4: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await handle.press("ArrowUp");
        },
        { box: true },
      );

      await test.step(
        "실행 5: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.reload();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 2. 변경한 그룹 순서를 새로고침 후 복원한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page.locator(".group-item .group-select strong"),
          ).toHaveText(["가방", "나무", "다람쥐", "Zulu", "Alpha"]);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
