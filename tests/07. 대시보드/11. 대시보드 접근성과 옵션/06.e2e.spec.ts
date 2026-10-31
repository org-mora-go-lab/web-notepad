import { expect, test } from "@playwright/test";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 6. Note 표시를 켜고 다시 끄면 컬럼과 눌림 상태를 함께 전환한다
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

test("6. Note 표시를 켜고 다시 끄면 컬럼과 눌림 상태를 함께 전환한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  const command = page.getByRole("button", { name: "Note", exact: true });
  await command.click();
  await expect(command).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".dashboard-icebox-column")).toBeVisible();
  await command.click();
  await expect(command).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".dashboard-icebox-column")).toHaveCount(0);
});
