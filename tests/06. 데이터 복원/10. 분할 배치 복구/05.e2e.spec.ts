import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreWorkspace(page, {
            rightBottomTabIds: ["tab-2"],
            activeRightBottomTabId: "tab-2",
            activePane: "right-bottom",
          });
        },
        { box: true },
      );

      const group = await readActiveGroup(page);

      await test.step(
        "검증 1: 5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.rightTabIds).toEqual(["tab-2"]);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.rightBottomTabIds).toEqual([]);
        },
        { box: true },
      );

      await test.step(
        "검증 3: 5. 오른쪽 상단이 비면 오른쪽 하단 노트를 상단으로 승격한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.activePane).toBe("right");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
