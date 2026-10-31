import { expect, test } from "@playwright/test";

import { authenticate, origin } from "../../__util__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 9. shared UUID 형식이 아닌 그룹 업데이트를 거부한다
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

test("9. shared UUID 형식이 아닌 그룹 업데이트를 거부한다", async ({
  page,
  context,
}) => {
  // Given: 로컬 그룹 ID와 빈 공유 데이터를 준비한다.
  // When: 공유 그룹 업데이트 API를 호출한다.
  // Then: 공유 ID 경계를 확인해 400으로 거부한다.
  await authenticate(context);
  const response = await page.request.post("/api/groups/update", {
    headers: origin,
    data: { id: "local", baseRevision: 0, data: {} },
  });

  expect(response.status()).toBe(400);
  expect(response.ok()).toBe(false);
  expect(response.headers()["content-type"]).toContain("application/json");
});
