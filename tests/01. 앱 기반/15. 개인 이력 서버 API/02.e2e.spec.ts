import { expect, test } from "@playwright/test";

import { snapshot } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 2. 비로그인 사용자는 개인 이력을 저장할 수 없다
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

test("2. 비로그인 사용자는 개인 이력을 저장할 수 없다", async ({ request }) => {
  // Given: 인증하지 않은 사용자가 정상 모양의 스냅샷을 만든다.
  // When: 개인 이력 저장 API에 POST한다.
  // Then: 본문 유효성보다 인증을 먼저 검사해 401을 반환한다.
  const response = await request.post("/api/notepad/history", {
    data: {
      eventId: crypto.randomUUID(),
      snapshot: snapshot(),
    },
  });

  expect(response.status()).toBe(401);
  expect(response.ok()).toBe(false);
  expect(response.headers()["content-type"]).toContain("application/json");
});
