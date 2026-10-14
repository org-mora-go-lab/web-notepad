import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { renameWorkGroup } from "./__util__";

test("5. 그룹 이름을 바꿔도 그룹 ID를 유지하고 새로고침 후 복원한다", async ({ page }) => {
  const originalId = await renameWorkGroup(page);
  const renamedGroup = (await readStoredState(page)).groups.find((group) => group.name === "Focus")!;
  expect(renamedGroup.id).toBe(originalId);

  await page.reload();
  const restoredGroup = (await readStoredState(page)).groups.find((group) => group.name === "Focus")!;
  expect(restoredGroup.id).toBe(originalId);
});
