import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import {
  addTabButton,
  createGroup,
  groupsCommand,
  readStoredState,
  seedStoredStateOnLoad,
} from "../../__util__";

test("6. 저장된 임의·액션 이름 필드를 무시하고 스토어 액션을 정상 실행한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Protected note"),
      ]),
    ],
    nextTabNumber: 2,
    updateTab: "corrupted update action",
    addTab: null,
    createGroup: { corrupted: true },
    arbitraryField: "must not enter the store",
  });

  const editor = page.locator("textarea");
  await editor.fill("Protected note edited");
  await addTabButton(page).click();
  await expect(page.locator(".tab-item")).toHaveCount(2);

  await groupsCommand(page).click();
  await createGroup(page, "Recovered actions");
  await expect(page.locator("textarea")).toHaveValue("");

  const stored = (await readStoredState(page)) as unknown as Record<
    string,
    unknown
  >;
  expect(stored).not.toHaveProperty("updateTab");
  expect(stored).not.toHaveProperty("addTab");
  expect(stored).not.toHaveProperty("createGroup");
  expect(stored).not.toHaveProperty("arbitraryField");
});
