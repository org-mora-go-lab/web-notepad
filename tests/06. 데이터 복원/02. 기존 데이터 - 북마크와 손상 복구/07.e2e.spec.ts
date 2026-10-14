import { expect, test } from "@playwright/test";

import { bookmarksCommand, switchGroup } from "../../__util__";
import { seedRecoveryCollision } from "./__util__";

test("7. 복구 북마크와 빈 그룹 복구 탭은 All Group에서도 독립된 내용을 유지한다", async ({ page }) => {
  await seedRecoveryCollision(page);
  await page.locator("textarea").fill("Recovered workspace");
  await switchGroup(page, "Work");
  await bookmarksCommand(page).click();
  await page
    .locator(".bookmark-item")
    .first()
    .getByRole("button", { name: "Open", exact: true })
    .click();
  await expect(page.locator("textarea")).toHaveValue("Archived note 2");

  await switchGroup(page, "All Group");
  await expect(page.locator(".tab-item")).toHaveCount(3);
  await page
    .getByRole("tab", { name: "Recovered workspace", exact: true })
    .click();
  await expect(page.locator("textarea")).toHaveValue("Recovered workspace");
});
