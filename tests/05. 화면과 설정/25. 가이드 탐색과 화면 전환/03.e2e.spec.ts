import { expect, test } from "@playwright/test";

import { openGuide } from "../../__util__";

test("3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      const guide = await openGuide(page);

      await test.step(
        "실행 1: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await guide
            .getByRole("button", { name: "Next", exact: true })
            .click();
        },
        { box: true },
      );

      await test.step(
        "실행 2: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await guide
            .getByRole("button", { name: "Next", exact: true })
            .click();
        },
        { box: true },
      );

      await test.step(
        "실행 3: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.keyboard.press("Escape");
        },
        { box: true },
      );

      await test.step(
        "실행 4: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openGuide(page);
        },
        { box: true },
      );

      await test.step(
        "검증 1: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(guide.locator(".user-guide-progress")).toHaveText(
            "1 / 11",
          );
        },
        { box: true },
      );

      await test.step(
        "검증 2: 3. 중간 단계에서 닫고 다시 연 가이드는 첫 단계부터 시작한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(guide.locator("h4")).toHaveText("Keyboard shortcuts");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
