import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("6. 빈 상태명과 알 수 없는 상태 키는 복원하지 않는다", async ({
  page,
}) => {
  await restoreWorkspace(page, {
    dashboardStatusNames: {
      todo: "  ",
      done: 42,
      deleted: "Unknown",
      "in-progress": "Working",
    },
  });
  expect((await readActiveGroup(page)).dashboardStatusNames).toEqual({
    "in-progress": "Working",
  });
});
