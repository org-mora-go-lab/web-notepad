import { expect, test } from "@playwright/test";

import { oauthStart } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 8. 외부 return 쿼리는 OAuth 리다이렉트 목적지를 바꾸지 못한다
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

test("8. 외부 return 쿼리는 OAuth 리다이렉트 목적지를 바꾸지 못한다", async ({
  request,
}) => {
  // Given: 외부 사이트 URL을 return 쿼리에 삽입한다.
  // When: OAuth 시작 엔드포인트를 호출한다.
  // Then: 외부 return을 무시하고 카카오 인증 호스트만 사용한다.
  const response = await oauthStart(
    request,
    "?return=https%3A%2F%2Fevil.example",
  );
  const location = new URL(response.headers().location);

  expect(response.status()).toBe(307);
  expect(location.hostname).toBe("kauth.kakao.com");
  expect(location.href).not.toContain("evil.example");
  expect(location.protocol).toBe("https:");
});
