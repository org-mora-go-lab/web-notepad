import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel, seedDashboardTabs } from "../../__util__";

test("2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedDashboardTabs(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openPanel(page, "dashboard-panel");
        },
        { box: true },
      );

      const panel = dashboardPanel(page);

      await test.step(
        "실행 3: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await panel
            .getByRole("button", { name: "Beta task", exact: true })
            .click();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            panel.locator(".dashboard-card.is-active .dashboard-card-open"),
          ).toContainText("Beta task");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 2. 고정 대시보드에서 다른 카드를 선택하면 현재 카드 강조를 함께 옮긴다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator("textarea")).toHaveValue("Beta task");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
