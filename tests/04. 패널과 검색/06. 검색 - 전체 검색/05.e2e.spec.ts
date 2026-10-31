import { expect, test } from "@playwright/test";

import {
  groupStatusName,
  openGlobalSearchPanel,
  seedStoredStateOnLoad,
} from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

/**
 * E2E 품질 계약
 * - PRD 요구사항: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다
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

test("5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox", { name: "Search everything" }).fill("Work");
  await page.getByRole("button", { name: "Select group Work" }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(page.locator("textarea")).toHaveValue("Quarterly goals");
});
