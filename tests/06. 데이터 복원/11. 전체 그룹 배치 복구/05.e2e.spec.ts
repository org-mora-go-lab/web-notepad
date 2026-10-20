import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("5. 전체 그룹의 잘못된 활성 분할은 기본 분할로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    { allGroupLayout: { activePane: "unknown", rightTabIds: ["tab-2"] } },
  );
  expect((await readStoredState(page)).allGroupLayout?.activePane).toBe("left");
});
