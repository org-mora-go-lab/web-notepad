import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("4. 저장된 사용자 상태명 양끝 공백은 제거한다", async ({ page }) => {
  await restoreWorkspace(page, { dashboardStatusNames: { todo: "  Ready  " } });
  expect((await readActiveGroup(page)).dashboardStatusNames).toEqual({
    todo: "Ready",
  });
});
