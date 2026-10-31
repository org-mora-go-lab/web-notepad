import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("4. 북마크 내용에서 제목과 중복되는 첫 줄을 제외한다", async ({
  page,
}) => {
  await test.step(
    "시나리오: 4. 북마크 내용에서 제목과 중복되는 첫 줄을 제외한다 — 준비 조건부터 공개 UI 또는 API 실행과 사용자 결과 검증까지 독립적으로 추적한다",
    async () => {
      const { detailLines } = await seedBookmarkContentItems(page);

      await test.step(
        "검증 1: 4. 북마크 내용에서 제목과 중복되는 첫 줄을 제외한다 — PRD에 기록된 사용자 결과를 이 파일의 assertion으로 직접 확인한다",
        async () => {
          await expect(
            page
              .locator(".bookmark-item")
              .first()
              .locator(".bookmark-item-content"),
          ).toHaveText(detailLines.join("\n"));
        },
        { box: true },
      );
    },
    { box: true },
  );
});
