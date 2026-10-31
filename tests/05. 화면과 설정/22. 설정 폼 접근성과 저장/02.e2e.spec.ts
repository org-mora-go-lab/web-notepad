import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      await test.step(
        "실행 1: 2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openSettingsPanel(page);
        },
        { box: true },
      );

      const group = page.getByRole("radiogroup", { name: "Font Size" });

      await test.step(
        "검증 1: 2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(group.getByRole("radio")).toHaveCount(6);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. Font Size는 여섯 가지 선택지를 제공하고 기본 90%를 선택한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(group.getByRole("radio", { name: "90%" })).toBeChecked();
        },
        { box: true },
      );
    },
    { box: true },
  );
});
