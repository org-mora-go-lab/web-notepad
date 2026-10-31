import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("3. 문자열이 아닌 북마크 제목과 내용은 안전한 표시값으로 복구한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 3. 문자열이 아닌 북마크 제목과 내용은 안전한 표시값으로 복구한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 3. 문자열이 아닌 북마크 제목과 내용은 안전한 표시값으로 복구한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreWorkspace(page, {
            bookmarks: [
              { id: "b1", sourceTabId: "gone", title: {}, content: 42 },
            ],
          });
        },
        { box: true },
      );

      await test.step(
        "검증 1: 3. 문자열이 아닌 북마크 제목과 내용은 안전한 표시값으로 복구한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect((await readActiveGroup(page)).bookmarks[0]).toMatchObject({
            title: "Untitled",
            content: "",
          });
        },
        { box: true },
      );
    },
    { box: true },
  );
});
