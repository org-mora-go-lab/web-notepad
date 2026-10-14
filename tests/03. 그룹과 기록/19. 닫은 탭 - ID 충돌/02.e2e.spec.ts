import { expect, test } from "@playwright/test";

import { readStoredState, restoreFirstClosedTab } from "../../__util__";
import { seedClosedTabIdCollision } from "./__fixture__";

test("2. ID 충돌을 해소해 복원한 탭은 닫은 탭 기록에서 제거한다", async ({ page }) => {
  await seedClosedTabIdCollision(page);
  await restoreFirstClosedTab(page);

  expect((await readStoredState(page)).closedTabs).toHaveLength(0);
});
