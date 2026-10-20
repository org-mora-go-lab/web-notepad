import { expect, test } from "@playwright/test";

import {
  moveDashboardCard,
  readActiveGroup,
  seedStatusIntegrity,
} from "../../__util__";

test("3. 백그라운드 카드의 상태 변경은 현재 편집 탭을 전환하지 않는다", async ({
  page,
}) => {
  await seedStatusIntegrity(page, {}, { activeTabId: "tab-2" });
  await moveDashboardCard(page, "Doing");
  await expect(page.locator("textarea")).toHaveValue("Sibling task");
  expect((await readActiveGroup(page)).activeTabId).toBe("tab-2");
});
