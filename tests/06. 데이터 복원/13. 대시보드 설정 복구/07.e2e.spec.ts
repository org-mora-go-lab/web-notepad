import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  openPanel,
  readActiveGroup,
  restoreWorkspace,
} from "../../__util__";

test("7. 문자열로 저장된 보조 상태 표시값은 참으로 취급하지 않는다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    dashboardVisibility: { icebox: "true", done: 1 },
  });
  expect((await readActiveGroup(page)).dashboardVisibility).toEqual({
    icebox: false,
    done: true,
  });
  await openPanel(page, "dashboard-panel");
  await expect(dashboardColumn(page, "icebox")).toHaveCount(0);
  await expect(dashboardColumn(page, "done")).toBeVisible();
});
