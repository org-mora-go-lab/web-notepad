import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand } from "../../__util__";

test("5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다", async ({
  sharing: { owner, id },
}) => {
  await test.step(
    "시나리오: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "준비 1: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — 다른 사례와 독립적으로 실행하는 데 필요한 상태와 화면을 먼저 구성한다",
        async () => {
          await owner.route("**/api/groups", (route) =>
            route.fulfill({ status: 503, json: { error: "Unavailable" } }),
          );
        },
        { box: true },
      );

      await test.step(
        "실행 1: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await owner.reload();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(owner.locator("button.auth-command")).toBeVisible();
        },
        { box: true },
      );

      await test.step(
        "실행 2: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          if (
            (await groupsCommand(owner).getAttribute("aria-expanded")) !==
            "true"
          )
            await groupsCommand(owner).click();
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            owner.locator('#group-shared-list [data-group-id="' + id + '"]'),
          ).toBeVisible();
        },
        { box: true },
      );
    },
    { box: true },
  );
});
