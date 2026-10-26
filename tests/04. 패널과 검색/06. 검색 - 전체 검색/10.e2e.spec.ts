import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";

test("10. 북마크하지 않은 다른 그룹의 탭 본문도 검색하고 원본 탭을 연다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { groups: [createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "Home note")]), createGroupFixture("project", "Project", [createTabFixture("tab-2", "Plan\nHidden body needle", { open: false })])], activeGroupId: "ungrouped" });
  await openGlobalSearchPanel(page); await page.getByRole("searchbox").fill("body needle");
  const result = page.locator(".global-search-tabs").getByRole("button", { name: "Open tab Plan", exact: true });
  await expect(result).toContainText("Project"); await expect(result.locator("mark")).toHaveText("body needle"); await result.click();
  await expect(page.locator(".group-current-value")).toHaveText("Project");
  await expect(page.getByRole("tab", { name: "Plan", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("textarea")).toHaveValue("Plan\nHidden body needle");
});
