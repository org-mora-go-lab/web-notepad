import { expect, test } from "@playwright/test";

import {
  createClosedTabFixture,
  createGroupFixture,
  createTabFixture,
} from "../../__fixture__";
import { openClosedPanel, seedStoredStateOnLoad } from "../../__util__";

test("2. 닫은 탭 검색 결과의 그룹명과 내용에서 일치 키워드를 강조한다", async ({
  page,
}) => {
  const group = createGroupFixture("work", "Work group", [
    createTabFixture("active-tab", "Current note"),
  ]);
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 2,
    closedTabs: [
      createClosedTabFixture(
        "closed-1",
        group.id,
        createTabFixture("closed-tab", "Beta note from Work"),
      ),
    ],
  });

  await openClosedPanel(page);
  const search = page.getByRole("searchbox", { name: "Search closed" });
  await search.fill("WORK");
  await expect(
    page.locator(".closed-item-heading mark.search-highlight"),
  ).toHaveText("Work");
  await expect(
    page.locator(".closed-item-content mark.search-highlight"),
  ).toHaveText("Work");
  await search.fill("BETA");
  await expect(
    page.locator(".closed-item-content mark.search-highlight"),
  ).toHaveText("Beta");
});
