import { expect, test } from "@playwright/test";

import {
  chooseGroupAction,
  groupsCommand,
  readStoredState,
  seedSortableGroups,
} from "../../__util__";

test("3. Close All은 선택한 그룹의 열린 에디터 탭을 모두 닫는다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await chooseGroupAction(page, "Zulu", "탭 닫기");

  const zulu = (await readStoredState(page)).groups.find(
    (group) => group.id === "zulu",
  );
  expect(zulu?.tabs.find((tab) => tab.id === "tab-2")?.open).toBe(false);
  expect(zulu?.tabs.filter((tab) => tab.open)).toHaveLength(1);
  expect(zulu?.tabs.find((tab) => tab.open)?.content).toBe("");
});
