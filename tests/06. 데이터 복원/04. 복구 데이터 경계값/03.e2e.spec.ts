import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("3. 그룹 이름이 문자열이 아니면 Untitled Group으로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "work",
    groups: [{ id: "work", name: 42, tabs: [{ id: "tab-1", content: "" }] }],
  });
  await expect(page.locator(".group-current-value")).toHaveText("Untitled Group");
});
