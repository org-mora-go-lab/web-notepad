import { expect, test } from "@playwright/test";

import {
  moveDashboardCard,
  readStoredState,
  seedStatusIntegrity,
} from "../../__util__";

test("8. 상태를 Closed로 옮기는 동작은 편집 탭 닫기나 보관 기록 생성을 수행하지 않는다", async ({
  page,
}) => {
  await seedStatusIntegrity(page);
  await moveDashboardCard(page, "Closed");
  const state = await readStoredState(page);
  expect(state.closedTabs).toEqual([]);
  expect(state.groups[0].tabs[0]).toMatchObject({
    open: true,
    dashboardStatus: "closed",
  });
  await expect(page.locator("textarea")).toHaveValue(
    "Integrity task\nkept body",
  );
});
