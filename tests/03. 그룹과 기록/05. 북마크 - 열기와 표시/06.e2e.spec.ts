import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      await test.step(
        "실행 1: 6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다 — 사용자가 접근할 수 있는 공개 UI 또는 API 경계를 통해 요구 동작을 수행한다",
        async () => {
          await seedBookmarkContentItems(page);
        },
        { box: true },
      );

      const emptyContent = page
        .locator(".bookmark-item")
        .last()
        .locator(".bookmark-item-content");

      await test.step(
        "검증 1: 6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(emptyContent).toHaveText("");
        },
        { box: true },
      );

      await test.step(
        "검증 2: 6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(emptyContent).toHaveCSS("height", "30px");
        },
        { box: true },
      );

      await test.step(
        "검증 3: 6. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(emptyContent).toHaveCSS("margin-top", "0px");
        },
        { box: true },
      );
    },
    { box: true },
  );
});
