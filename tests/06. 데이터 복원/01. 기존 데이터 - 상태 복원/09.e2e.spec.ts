import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("9. 저장된 레드·그린·그레이 탭 색상을 그대로 유지한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [{
      id: "ungrouped",
      name: "Ungrouped",
      activeTabId: "tab-1",
      tabs: ["red", "green", "gray"].map((tabColor, index) => ({
        id: `tab-${index + 1}`,
        content: "",
        tabColor,
      })),
    }],
  });

  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(3);
  for (const [index, color] of ["red", "green", "gray"].entries()) {
    await expect(tabs.nth(index)).toHaveAttribute("data-tab-color", color);
  }
});
