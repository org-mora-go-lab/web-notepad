import { expect, test } from "@playwright/test";

import { seedBookmarkContentItems } from "./__fixture__";

test("3. 북마크 항목에는 더보기나 접기 버튼을 표시하지 않는다", async ({ page }) => {
  await seedBookmarkContentItems(page);

  await expect(page.getByRole("button", { name: /더보기|간소화|More|Collapse/ })).toHaveCount(0);
});
