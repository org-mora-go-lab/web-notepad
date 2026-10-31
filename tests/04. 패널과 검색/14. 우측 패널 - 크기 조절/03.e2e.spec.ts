import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dragPanelEdgeTo } from "../__util__";

test("3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다", async ({ page }) => {
  await test.step(
    "시나리오: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.setViewportSize(DESKTOP_VIEWPORT);
        },
        { box: true },
      );

      await test.step(
        "준비 2: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      await test.step(
        "실행 1: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openPanel(page, "dashboard-panel");
        },
        { box: true },
      );

      const panel = page.locator("#dashboard-panel");

      await test.step(
        "실행 2: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await dragPanelEdgeTo(
            page,
            "dashboard-panel",
            DESKTOP_VIEWPORT.width - 520,
          );
        },
        { box: true },
      );

      await test.step(
        "검증 1: 3. 우측에 배치한 고정 패널의 크기를 조절할 수 있다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect
            .poll(async () => (await panel.boundingBox())!.width)
            .toBeCloseTo(520, 1);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
