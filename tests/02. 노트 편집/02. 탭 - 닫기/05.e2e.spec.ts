import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { readStoredState, writeStoredState } from "../../__util__";

test("5. All Group의 오른쪽 끝 탭을 닫으면 같은 패널의 바로 왼쪽 탭을 선택한다", async ({
  page,
}) => {
  for (const split of [false, true]) {
    await writeStoredState(page, {
      activeGroupId: "all-group",
      allGroupActiveTabId: "third",
      allGroupLayout: split
        ? {
            rightTabIds: ["second", "third"],
            activeRightTabId: "third",
            activePane: "right",
          }
        : {},
      groups: [
        createGroupFixture("ungrouped", "Ungrouped", [
          createTabFixture("first", "First"),
        ]),
        createGroupFixture("work", "Work", [
          createTabFixture("second", "Second"),
          createTabFixture("third", "Third"),
        ]),
      ],
    });
    await page.getByRole("tab", { name: "Third", exact: true }).click();
    await expect(
      page.getByRole("tab", { name: "Third", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .getByRole("tab", { name: "Third", exact: true })
      .locator("..")
      .locator(".tab-close")
      .click();
    await expect(
      page.getByRole("tab", { name: "Second", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    expect((await readStoredState(page)).allGroupActiveTabId).toBe("second");
    await expect(
      page.getByRole("textbox", { name: "Second note content" }),
    ).toHaveValue("Second");
    await page.reload();
    await expect(
      page.getByRole("tab", { name: "Second", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .getByRole("tab", { name: "Second", exact: true })
      .locator("..")
      .locator(".tab-close")
      .click();
    await expect(
      page.getByRole("tab", { name: "First", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    const stored = await readStoredState(page);
    expect(
      stored.groups
        .find((group) => group.id === "work")!
        .tabs.filter((tab) => tab.content)
        .map((tab) => ({ content: tab.content, open: tab.open })),
    ).toEqual([
      { content: "Second", open: false },
      { content: "Third", open: false },
    ]);
  }
});
