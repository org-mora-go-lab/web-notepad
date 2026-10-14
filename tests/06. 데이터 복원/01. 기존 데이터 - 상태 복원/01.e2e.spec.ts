import { expect, test } from "@playwright/test";

import { expectSelectedLines, lineButtons, seedStoredStateOnLoad } from "../../__util__";

test("1. 누락되거나 잘못된 저장 필드를 정규화하고 탭 색상은 그린·선택 줄은 선택 없음으로 복원한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      {
        id: "ungrouped",
        name: "Ungrouped",
        tabs: [
          { id: "tab-1", content: "normalized\nsecond", tabColor: "invalid" },
          { id: "tab-2" },
          { id: "tab-3", tabColor: 42, pinned: "yes" },
        ],
      },
    ],
  });
  await expect(page.locator("textarea")).toHaveValue("normalized\nsecond");
  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(3);
  for (const index of [0, 1, 2]) {
    await expect(tabs.nth(index)).toHaveAttribute("data-tab-color", "green");
  }
  await expect(lineButtons(page)).toHaveCount(2);
  await expectSelectedLines(page, [false, false]);
});
