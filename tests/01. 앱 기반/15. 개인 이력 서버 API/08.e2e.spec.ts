import { expect, test } from "@playwright/test";

import { authenticate, historyPost } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 8. 5MB를 초과한 스냅샷을 저장하지 않는다
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

test("8. 5MB를 초과한 스냅샷을 저장하지 않는다", async ({ page, context }) => {
  // Given: 허용 크기를 넘는 5MB 초과 스냅샷을 만든다.
  // When: 인증된 이력 저장 API에 전송한다.
  // Then: 과도한 저장 요청을 400으로 제한한다.
  await authenticate(context);
  const oversized = "x".repeat(5_000_001);
  const response = await historyPost(page, {
    eventId: crypto.randomUUID(),
    snapshot: oversized,
  });

  expect(oversized.length).toBeGreaterThan(5_000_000);
  expect(response.status()).toBe(400);
  expect(response.ok()).toBe(false);
});
