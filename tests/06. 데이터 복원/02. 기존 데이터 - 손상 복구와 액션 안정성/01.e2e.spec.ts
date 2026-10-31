import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../../__util__";
import { expectRestoredBookmark } from "./__util__";

test("1. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 1. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 1. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await restoreStoredBookmark(page, {});
        },
        { box: true },
      );

      await test.step(
        "실행 2: 1. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await expectRestoredBookmark(page, {
            tabColor: "green",
            pressedLines: [false, false, false],
          });
        },
        { box: true },
      );
    },
    { box: true },
  );
});
