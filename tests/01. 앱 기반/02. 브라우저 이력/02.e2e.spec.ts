import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { groupsCommand, groupStatusName, seedStoredStateOnLoad } from "../../__util__";

test("2. 그룹 전환 이력은 전환 전후 그룹의 활성 탭과 분할 상태를 복원한다", async ({ page }) => {
  const ungrouped = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [createTabFixture("u-left", "Ungrouped left"), createTabFixture("u-right", "Ungrouped right")],
    { rightTabIds: ["u-right"], activeRightTabId: "u-right", activePane: "left" },
  );
  const work = createGroupFixture(
    "work",
    "Work",
    [
      createTabFixture("w-left-a", "Work left A"),
      createTabFixture("w-left-b", "Work left B"),
      createTabFixture("w-right", "Work right"),
    ],
    {
      activeTabId: "w-left-b",
      rightTabIds: ["w-right"],
      activeRightTabId: "w-right",
      activePane: "right",
    },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: ungrouped.id,
    groups: [ungrouped, work],
    nextTabNumber: 6,
  });

  const panes = page.locator(".pane-slot");
  await groupsCommand(page).click();
  await page.locator(".group-item").getByRole("button", { name: "Work", exact: true }).click();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(panes).toHaveCount(2);
  await expect(panes.nth(0).locator("textarea")).toHaveValue("Work left B");
  await expect(panes.nth(1).locator("textarea")).toHaveValue("Work right");
  await expect(panes.nth(1).locator(".note-pane")).not.toHaveClass(/is-unfocused/);
  await expect.poll(() => new URL(page.url()).searchParams.get("group")).toBe("work");

  await page.goBack();
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await expect(panes.nth(0).locator("textarea")).toHaveValue("Ungrouped left");
  await expect(panes.nth(1).locator("textarea")).toHaveValue("Ungrouped right");
  await expect(panes.nth(0).locator(".note-pane")).not.toHaveClass(/is-unfocused/);

  await page.goForward();
  await expect(groupStatusName(page)).toHaveText("Work");
  await expect(panes.nth(0).locator("textarea")).toHaveValue("Work left B");
  await expect(panes.nth(1).locator("textarea")).toHaveValue("Work right");
  await expect(panes.nth(1).locator(".note-pane")).not.toHaveClass(/is-unfocused/);
});
