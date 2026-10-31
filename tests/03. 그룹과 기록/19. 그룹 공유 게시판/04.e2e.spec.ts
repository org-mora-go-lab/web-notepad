import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다", async ({
  page,
  boardPost,
}) => {
  await test.step(
    "시나리오: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      await test.step(
        "실행 1: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openBoard(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await selectBoardPost(page, boardPost.title);
        },
        { box: true },
      );

      await test.step(
        "실행 3: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.getByRole("link", { name: "Join this group" }).click();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page.getByRole("link", { name: "Continue with Kakao" }).last(),
          ).toBeVisible();
        },
        { box: true },
      );

      await test.step(
        "검증 2: 4. 비로그인 방문자가 초대를 열면 로그인 안내와 원래 공유 링크를 유지한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page).toHaveURL(/share=/);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
