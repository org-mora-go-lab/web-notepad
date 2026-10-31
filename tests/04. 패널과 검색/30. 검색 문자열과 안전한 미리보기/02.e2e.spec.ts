import { expect, test } from "@playwright/test";

import { createBookmarkFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedSearchWorkspace } from "../../__util__";

test("2. 한글 검색어로 북마크 본문을 검색한다", async ({ page }) => {
  await test.step(
    "시나리오: 2. 한글 검색어로 북마크 본문을 검색한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 2. 한글 검색어로 북마크 본문을 검색한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedSearchWorkspace(page, [
            createBookmarkFixture("b1", "gone", "회의 기록\n내일 일정 확인"),
          ]);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 2. 한글 검색어로 북마크 본문을 검색한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openGlobalSearchPanel(page);
        },
        { box: true },
      );

      await test.step(
        "실행 3: 2. 한글 검색어로 북마크 본문을 검색한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page
            .getByRole("searchbox", { name: "Search everything" })
            .fill("내일 일정");
        },
        { box: true },
      );

      await test.step(
        "검증 1: 2. 한글 검색어로 북마크 본문을 검색한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page.getByRole("button", { name: "Preview bookmark 회의 기록" }),
          ).toBeVisible();
        },
        { box: true },
      );
    },
    { box: true },
  );
});
