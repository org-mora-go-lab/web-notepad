import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 1. 노트 상태는 web-notepad-storage 키로 저장되고 새로고침 후 복원된다
 * - 이 파일은 하나의 사용자 또는 서버 시나리오만 검증한다.
 * - 준비 조건은 테스트 본문이나 이름이 드러나는 준비 함수로 구성한다.
 * - 실행 동작은 공개 UI 또는 API 경계를 통해 수행한다.
 * - 핵심 결과 assertion은 이 파일 안에서 직접 확인할 수 있어야 한다.
 * - 번호만 전달해 검증 전체를 외부 함수에 위임하지 않는다.
 * - 실패 메시지는 위반된 사용자 계약을 바로 식별할 수 있어야 한다.
 * - PRD 번호와 이 테스트 파일 번호는 항상 일치시킨다.
 * - 공통 유틸은 데이터 준비와 반복 입력 동작에만 사용한다.
 * - 테스트 수정 시 대응하는 tests-prd 문서도 함께 현행화한다.
 */

test("1. 노트 상태는 web-notepad-storage 키로 저장되고 새로고침 후 복원된다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea").first();
  await editor.fill("persisted note");
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
    .toContain("persisted note");
  await page.reload();
  await expect(editor).toHaveValue("persisted note");
});
