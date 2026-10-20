import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("9. 전체 그룹 배치가 문자열로 손상되면 개별 그룹의 노트는 그대로 이용한다", async ({
  page,
}) => {
  await restoreWorkspace(page, {}, { allGroupLayout: "broken" });
  expect((await readStoredState(page)).allGroupLayout).toBeNull();
  await expect(page.locator("textarea")).toHaveValue("Alpha\nsecond\nthird");
});
