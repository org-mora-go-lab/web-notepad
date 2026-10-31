import { expect, test } from "@playwright/test";

test("3. 새 탭 버튼은 접근 가능한 이름과 툴팁을 제공한다", async ({ page }) => {
  await test.step(
    "시나리오: 3. 새 탭 버튼은 접근 가능한 이름과 툴팁을 제공한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 3. 새 탭 버튼은 접근 가능한 이름과 툴팁을 제공한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      const button = page.getByRole("button", { name: "New tab", exact: true });

      await test.step(
        "검증 1: 3. 새 탭 버튼은 접근 가능한 이름과 툴팁을 제공한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(button).toHaveAttribute("title", "New tab");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
