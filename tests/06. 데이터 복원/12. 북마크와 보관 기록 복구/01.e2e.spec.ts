import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("1. 북마크 목록에서 ID가 없는 손상 항목만 제거한다", async ({ page }) => {
  await test.step(
    "시나리오: 1. 북마크 목록에서 ID가 없는 손상 항목만 제거한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 1. 북마크 목록에서 ID가 없는 손상 항목만 제거한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreWorkspace(page, {
            bookmarks: [
              null,
              {},
              42,
              createBookmarkFixture("b1", "tab-1", "Kept bookmark"),
            ],
          });
        },
        { box: true },
      );

      const bookmarks = (await readActiveGroup(page)).bookmarks;

      await test.step(
        "검증 1: 1. 북마크 목록에서 ID가 없는 손상 항목만 제거한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(bookmarks.map((bookmark) => bookmark.id)).toEqual(["b1"]);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
