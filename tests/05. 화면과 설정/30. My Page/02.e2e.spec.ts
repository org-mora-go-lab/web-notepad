import { expect, test } from "@playwright/test";

test("2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/my-page");
        },
        { box: true },
      );

      await test.step(
        "검증 1: 2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page
              .locator(".my-page-notice")
              .getByRole("link", { name: "Continue with Kakao" }),
          ).toBeVisible();
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. 비로그인 직접 접근은 로그인 안내를 표시하고 개인 통계를 숨긴다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".my-page-metrics")).toHaveCount(0);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
