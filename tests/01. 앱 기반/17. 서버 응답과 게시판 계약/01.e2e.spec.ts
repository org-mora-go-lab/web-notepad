import { expect, test } from "@playwright/test";

import { getApi } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 1. 비로그인 사용자의 공유 그룹 목록 조회를 거부한다
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

test("1. 비로그인 사용자의 공유 그룹 목록 조회를 거부한다", async ({
  request,
}) => {
  // Given: 인증되지 않은 사용자가 개인 그룹을 요청한다.
  // When: 그룹 목록 API를 조회한다.
  // Then: 개인 데이터 없이 401을 반환한다.
  const response = await getApi(request, "/api/groups");

  expect(response.status()).toBe(401);
  expect(response.ok()).toBe(false);
  expect(response.headers()["content-type"]).toContain("application/json");
  const payload = await response.json();
  expect(payload).toBeTruthy();
  expect(payload).not.toHaveProperty("groups");
});
