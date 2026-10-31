import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreWorkspace(page, {
            rightTabIds: ["tab-2", "tab-2"],
            leftBottomTabIds: ["tab-2", "tab-3"],
            rightBottomTabIds: ["tab-2", "tab-3"],
          });
        },
        { box: true },
      );

      const group = await readActiveGroup(page);

      await test.step(
        "검증 1: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.rightTabIds).toEqual(["tab-2"]);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.leftBottomTabIds).toEqual(["tab-3"]);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.rightBottomTabIds).toEqual([]);
        },
        { box: true },
      );

      await test.step(
        "검증 4: 3. 하나의 탭이 여러 분할에 중복 배정되면 한 분할에서만 연다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.getByRole("tab")).toHaveCount(3);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
