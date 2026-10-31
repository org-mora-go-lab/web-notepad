import { expect, test } from "@playwright/test";

test("6. 모든 표시 중인 버튼은 명시적인 button 타입을 사용한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 6. 모든 표시 중인 버튼은 명시적인 button 타입을 사용한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 6. 모든 표시 중인 버튼은 명시적인 button 타입을 사용한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      const types = await page
        .locator("button:visible")
        .evaluateAll((buttons) =>
          buttons.map((button) => button.getAttribute("type")),
        );

      await test.step(
        "검증 1: 6. 모든 표시 중인 버튼은 명시적인 button 타입을 사용한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(
            types.every((type) => type === "button" || type === "submit"),
          ).toBe(true);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
