import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { activeTab, openTabMenu, writeStoredState } from "../../__util__";

test("7. 그룹 이동 목록은 고정 그룹을 일반 그룹보다 먼저 배치한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "source",
    groups: [
      createGroupFixture("source", "Source", [
        createTabFixture("source-tab", "source"),
      ]),
      createGroupFixture("normal", "가방", [
        createTabFixture("normal-tab", "normal"),
      ]),
      createGroupFixture(
        "pinned",
        "Zulu",
        [createTabFixture("pinned-tab", "pinned")],
        { pinned: true },
      ),
    ],
  });
  await openTabMenu(activeTab(page));
  await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
  await expect(page.locator(".move-group-option")).toHaveText(["Zulu", "가방"]);
});
