import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { groupsCommand, seedStoredStateOnLoad } from "../../__util__";

test("7. 그룹이 많아도 각 영역만 스크롤하며 Shared Group과 생성·전체 그룹을 유지한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    groups: Array.from({ length: 20 }, (_, i) =>
      createGroupFixture(i ? "group-" + i : "ungrouped", "Group " + i, [
        createTabFixture("tab-" + i, "Note " + i),
      ]),
    ),
    activeGroupId: "ungrouped",
  });
  await groupsCommand(page).click();
  const my = page.locator("#group-my-list");
  expect(await my.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(
    true,
  );
  const before = (await page
    .getByRole("button", { name: "Shared Group", exact: true })
    .boundingBox())!.y;
  await my.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(
    (await page
      .getByRole("button", { name: "Shared Group", exact: true })
      .boundingBox())!.y,
  ).toBe(before);
  await expect(
    page.getByRole("textbox", { name: "New group name" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "All Group", exact: true }),
  ).toBeInViewport();
});
