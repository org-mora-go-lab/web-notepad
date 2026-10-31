import { expect, test } from "@playwright/test";

import { groupsCommand, seedSortableGroups } from "../../__util__";

test("2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSortableGroups(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await groupsCommand(page).click();
        },
        { box: true },
      );

      await test.step(
        "실행 3: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.locator(".system-group-command").click();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page.getByRole("textbox", { name: "New group name" }),
          ).toBeVisible();
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. 그룹 드롭다운에는 그룹 추가만 표시하고 섹션 추가는 표시하지 않는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".group-section-create-form")).toHaveCount(
            0,
          );
        },
        { box: true },
      );
    },
    { box: true },
  );
});
