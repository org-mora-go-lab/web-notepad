import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("2. 존재하지 않는 활성 그룹 ID는 Ungrouped로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { activeGroupId: "missing", groups: [] });
  await expect(page.locator(".group-current-value")).toHaveText("Ungrouped");
});
