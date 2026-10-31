import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel, waitForStoredState } from "../../__util__";
import { fontScaleRadio } from "../__util__";

test("1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다", async ({ page }) => {
  await test.step(
    "시나리오: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await page.goto("/");
        },
        { box: true },
      );

      await test.step(
        "실행 1: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await waitForStoredState(page);
        },
        { box: true },
      );

      await test.step(
        "실행 2: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.evaluate((key) => {
            const stored = JSON.parse(localStorage.getItem(key)!);
            stored.state.settings.fontScale = 3;
            localStorage.setItem(key, JSON.stringify(stored));
          }, STORAGE_KEY);
        },
        { box: true },
      );

      await test.step(
        "실행 3: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.reload();
        },
        { box: true },
      );

      await test.step(
        "실행 4: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openSettingsPanel(page);
        },
        { box: true },
      );

      await test.step(
        "검증 1: 1. 잘못된 폰트 크기 저장값은 기본값 90%로 복원한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(fontScaleRadio(page, "90%")).toBeChecked();
        },
        { box: true },
      );
    },
    { box: true },
  );
});
