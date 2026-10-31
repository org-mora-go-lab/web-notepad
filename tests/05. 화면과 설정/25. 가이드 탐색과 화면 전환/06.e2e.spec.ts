import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openGuide, writeStoredState } from "../../__util__";

test("6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.setViewportSize(MOBILE_VIEWPORT);
        },
        { box: true },
      );

      await test.step(
        "실행 1: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await writeStoredState(page, { settings: { language: "ko" } });
        },
        { box: true },
      );

      const guide = await openGuide(page);

      await test.step(
        "검증 1: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(guide.locator("h4")).toHaveText("메모 작성");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(guide.locator(".user-guide-progress")).toHaveText(
            "1 / 10",
          );
        },
        { box: true },
      );

      await test.step(
        "검증 3: 6. 한국어 모바일 가이드는 단축키 없이 메모 작성부터 시작한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(guide.locator(".user-guide-shortcut")).toHaveCount(0);
        },
        { box: true },
      );
    },
    { box: true },
  );
});
