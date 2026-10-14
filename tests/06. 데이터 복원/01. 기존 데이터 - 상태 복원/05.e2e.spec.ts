import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("5. 저장된 블루 탭 색상을 레드로 변환한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: [{ id: "tab-1", content: "", tabColor: "blue" }],
    }],
  });
  await expect(page.locator(".tab-item")).toHaveAttribute("data-tab-color", "red");
});
