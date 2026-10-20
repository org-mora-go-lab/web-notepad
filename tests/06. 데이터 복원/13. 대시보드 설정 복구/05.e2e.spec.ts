import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("5. 너무 긴 사용자 상태명은 30자로 제한해 복원한다", async ({ page }) => {
  await restoreWorkspace(page, {
    dashboardStatusNames: { todo: "A".repeat(60) },
  });
  expect((await readActiveGroup(page)).dashboardStatusNames?.todo).toBe(
    "A".repeat(30),
  );
});
