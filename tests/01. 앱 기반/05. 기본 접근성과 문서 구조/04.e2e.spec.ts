import { expect, test } from "@playwright/test";

test("4. 모바일 화면에서 문서에 가로 오버플로를 만들지 않는다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 4. 모바일 화면에서 문서에 가로 오버플로를 만들지 않는다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 4. 모바일 화면에서 문서에 가로 오버플로를 만들지 않는다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.setViewportSize({ width: 390, height: 844 });
        },
        { box: true },
      );

      await test.step(
        "준비 2: 4. 모바일 화면에서 문서에 가로 오버플로를 만들지 않는다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      await test.step(
        "검증 1: 4. 모바일 화면에서 문서에 가로 오버플로를 만들지 않는다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
