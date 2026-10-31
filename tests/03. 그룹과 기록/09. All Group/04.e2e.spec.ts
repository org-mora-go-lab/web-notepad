import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedAllGroupOriginTabs } from "./__fixture__";

test("4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedAllGroupOriginTabs(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page
            .getByRole("tab", { name: "Work only task", exact: true })
            .click();
        },
        { box: true },
      );

      await test.step(
        "실행 3: 4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.locator("textarea").fill("Work only task edited");
        },
        { box: true },
      );

      const work = (await readStoredState(page)).groups.find(
        (group) => group.id === "work",
      )!;

      await test.step(
        "검증 1: 4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          expect(work.tabs[0].content).toBe("Work only task edited");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
