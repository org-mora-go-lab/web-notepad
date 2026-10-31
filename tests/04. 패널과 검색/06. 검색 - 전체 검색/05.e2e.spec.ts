import { expect, test } from "@playwright/test";

import {
  groupStatusName,
  openGlobalSearchPanel,
  seedStoredStateOnLoad,
} from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedStoredStateOnLoad(page, createGlobalSearchState());
        },
        { box: true },
      );

      await test.step(
        "실행 2: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await openGlobalSearchPanel(page);
        },
        { box: true },
      );

      await test.step(
        "실행 3: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page
            .getByRole("searchbox", { name: "Search everything" })
            .fill("Work");
        },
        { box: true },
      );

      await test.step(
        "실행 4: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await page.getByRole("button", { name: "Select group Work" }).click();
        },
        { box: true },
      );

      await test.step(
        "검증 1: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(groupStatusName(page)).toHaveText("Work");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 5. 그룹 검색 결과를 선택하면 해당 그룹으로 이동한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(page.locator("textarea")).toHaveValue("Quarterly goals");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
