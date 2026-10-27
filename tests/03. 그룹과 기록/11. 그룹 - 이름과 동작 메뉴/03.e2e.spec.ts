import { expect, test } from "@playwright/test";

import { readActiveGroup, readStoredState } from "../../__util__";
import { renameWorkGroup } from "./__util__";

test("3. 그룹 이름을 바꿔도 ID와 북마크를 유지하고 복원한다", async ({
  page,
}) => {
  const originalId = await renameWorkGroup(page);
  const renamedGroup = (await readStoredState(page)).groups.find(
    (group) => group.name === "Focus",
  )!;
  expect(renamedGroup.id).toBe(originalId);
  expect((await readActiveGroup(page)).bookmarks[0].content).toBe(
    "private note",
  );

  await page.reload();
  const restoredGroup = (await readStoredState(page)).groups.find(
    (group) => group.name === "Focus",
  )!;
  expect(restoredGroup.id).toBe(originalId);
  expect((await readActiveGroup(page)).bookmarks[0].content).toBe(
    "private note",
  );
});
