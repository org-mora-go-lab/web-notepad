import { expect, test } from "@playwright/test";

import {
  groupActionsButton,
  groupsCommand,
  seedSortableGroups,
} from "../../__util__";

test("1. 그룹 메뉴에서 Pin을 제거하고 Close All을 제공한다", async ({
  page,
}) => {
  await seedSortableGroups(page);
  await groupsCommand(page).click();
  await groupActionsButton(page, "Zulu").click();

  await expect(page.getByRole("button", { name: "Close All" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Pin .* group/ })).toHaveCount(
    0,
  );
});
