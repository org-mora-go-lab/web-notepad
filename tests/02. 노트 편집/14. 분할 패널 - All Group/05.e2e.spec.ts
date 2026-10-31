import { expect, test } from "@playwright/test";

import { paneSlot } from "../__util__";
import { createAllGroupQuad } from "./__util__";

test("5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const tab = await createAllGroupQuad(page);

      await test.step(
        "실행 1: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await tab("b")
            .locator(".tab-title")
            .dragTo(paneSlot(page, "left").locator(".header"));
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator(".pane-slot")).toHaveCount(3);
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            paneSlot(page, "left").getByRole("tab", { name: "b", exact: true }),
          ).toHaveAttribute("aria-selected", "true");
        },
        { box: true },
      );

      await test.step(
        "실행 2: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.reload();
        },
        { box: true },
      );

      await test.step(
        "검증 3: 5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(paneSlot(page, "left").locator("textarea")).toHaveValue(
            "b",
          );
        },
        { box: true },
      );
    },
    { box: true },
  );
});
