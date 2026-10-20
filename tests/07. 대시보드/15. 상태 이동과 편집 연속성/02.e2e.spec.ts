import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  moveDashboardCard,
  readActiveGroup,
  seedStatusIntegrity,
} from "../../__util__";

test("2. 상태 이동은 사용자 지정 색상 주기의 대상 색상을 사용한다", async ({
  page,
}) => {
  await seedStatusIntegrity(
    page,
    { dashboardStatus: "icebox" },
    {},
    { settings: { tabColorCycle: ["red", "purple", "pink"] } },
  );
  await moveDashboardCard(page, "Done");
  const tab = (await readActiveGroup(page)).tabs[0];
  expect(tab.tabColor).toBe("pink");
  expect(tab.dashboardStatus).toBeUndefined();
  await expect(
    dashboardColumn(page, "done").locator(".dashboard-card", {
      hasText: "Integrity task",
    }),
  ).toBeVisible();
});
