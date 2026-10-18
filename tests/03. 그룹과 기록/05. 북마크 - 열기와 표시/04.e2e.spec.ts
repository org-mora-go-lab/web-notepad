import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("4. 북마크 내용에서 제목과 중복되는 첫 줄을 제외한다", async ({ page }) => {
  const { detailLines } = await seedBookmarkContentItems(page);

  await expect(page.locator(".bookmark-item").first().locator(".bookmark-item-content"))
    .toHaveText(detailLines.join("\n"));
});
