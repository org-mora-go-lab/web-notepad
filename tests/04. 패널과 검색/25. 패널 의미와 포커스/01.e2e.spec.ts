import { expect, test } from "@playwright/test";

test("1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      const panel = page.locator("#dashboard-panel");

      await test.step(
        "검증 1: 1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(panel).toHaveAttribute("aria-hidden", "true");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(panel).toHaveAttribute("inert", "");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
