import { expect, test } from "@playwright/test";

import { authenticate } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 9. 로그아웃 세션 쿠키는 HttpOnly SameSite Lax와 즉시 만료를 사용한다
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

test("9. 로그아웃 세션 쿠키는 HttpOnly SameSite Lax와 즉시 만료를 사용한다", async ({
  page,
  context,
}) => {
  // Given: 로그인 세션 쿠키가 브라우저에 설정되어 있다.
  // When: 로그아웃 응답의 Set-Cookie를 확인한다.
  // Then: HttpOnly·SameSite=Lax와 즉시 만료를 모두 적용한다.
  await authenticate(context);
  const response = await page.request.post("/api/auth/logout");
  const cookie = response.headers()["set-cookie"];
  const normalized = cookie.toLowerCase();

  expect(response.status()).toBe(200);
  expect(cookie).toContain("web-notepad-session=");
  expect(normalized).toContain("httponly");
  expect(normalized).toContain("samesite=lax");
  expect(cookie).toContain("Max-Age=0");
});
