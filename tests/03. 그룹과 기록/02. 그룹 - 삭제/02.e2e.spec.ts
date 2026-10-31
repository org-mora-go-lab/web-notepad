import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedDeletableGroup } from "./__util__";

test("2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const { toggle, openDelete, popup } = await seedDeletableGroup(page);

      await test.step(
        "실행 1: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await toggle.click();
        },
        { box: true },
      );

      await test.step(
        "실행 2: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openDelete();
        },
        { box: true },
      );

      await test.step(
        "실행 3: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await popup
            .getByRole("button", { name: "Cancel", exact: true })
            .click();
        },
        { box: true },
      );

      const group = (await readStoredState(page)).groups.find(
        (item) => item.name === "Archive",
      )!;

      await test.step(
        "검증 1: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.tabs[0].content).toBe("archived note");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. 삭제 팝업의 취소 버튼은 그룹과 노트·북마크를 유지한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(group.bookmarks[0].content).toBe("archived note");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
