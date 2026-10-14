import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("5. 활성 탭을 닫으면 URL의 탭 ID를 새 활성 탭으로 교체한다", async ({ page }) => {
  const group = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [
      createTabFixture("tab-a", "A note"),
      createTabFixture("tab-b", "B note"),
      createTabFixture("tab-c", "C note"),
    ],
    { activeTabId: "tab-b" },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 4,
  });

  await page.getByRole("button", { name: "Close B note" }).click();
  await expect(page.locator("textarea")).toHaveValue("C note");
  await expect.poll(() => new URL(page.url()).searchParams.get("leftTab")).toBe("tab-c");
});
