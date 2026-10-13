import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand } from "../__util__";

test("21. Ungrouped와 All Group을 다른 그룹보다 옅은 같은 색으로 표시한다", async ({ page }) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const ungrouped = page
    .locator("#groups-panel .group-item")
    .filter({ hasText: "Ungrouped" })
    .locator("strong");
  const created = page
    .locator("#groups-panel .group-item")
    .filter({ hasText: "Work" })
    .locator("strong");
  const allGroup = page
    .locator("#groups-panel .group-item")
    .filter({ hasText: "All Group" })
    .locator("strong");
  await createGroup(page, "Work");

  await expect(ungrouped).toHaveCSS("color", "rgb(133, 133, 127)");
  await expect(allGroup).toHaveCSS("color", "rgb(133, 133, 127)");
  await expect(created).toHaveCSS("color", "rgb(143, 227, 176)");
});
