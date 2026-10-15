import { expect, test } from "@playwright/test";

import { addTabButton, readStoredState } from "../../__util__";

test("6. 북마크된 탭도 가운데 클릭으로 확인 없이 바로 닫는다", async ({ page }) => {
  await page.goto("/");
  const tabs = page.locator(".tab-item");
  await page.locator("textarea").fill("bookmarked content");
  await tabs.first().getByRole("tab").click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await addTabButton(page).click();

  await tabs.first().getByRole("tab").click({ button: "middle" });
  await expect(tabs).toHaveCount(1);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect.poll(async () => (await readStoredState(page)).closedTabs?.[0].tab.bookmarked).toBe(true);
});
