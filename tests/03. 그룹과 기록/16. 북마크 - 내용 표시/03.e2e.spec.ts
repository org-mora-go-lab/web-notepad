import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("3. 제목을 제외한 내용이 없으면 높이 30px의 빈 내용 영역을 표시한다", async ({ page }) => {
  await seedBookmarkContentItems(page);
  const emptyContent = page.locator(".bookmark-item").last().locator(".bookmark-item-content");

  await expect(emptyContent).toHaveText("");
  await expect(emptyContent).toHaveCSS("height", "30px");
  await expect(emptyContent).toHaveCSS("margin-top", "0px");
});
