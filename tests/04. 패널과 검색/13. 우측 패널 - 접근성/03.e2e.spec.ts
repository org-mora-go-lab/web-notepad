import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("3. 닫힌 패널 컨트롤은 Tab 순서와 접근성 탐색에서 제외한다", async ({ page }) => {
  await page.goto("/");

  const panels = page.locator(".side-panel-drawer");
  await expect(panels).toHaveCount(4);
  expect(
    await panels.evaluateAll((elements) =>
      elements.every(
        (element) =>
          element.getAttribute("aria-hidden") === "true" &&
          element.hasAttribute("inert"),
      ),
    ),
  ).toBe(true);

  const dashboardCommand = page
    .locator('button[aria-controls="dashboard-panel"]:visible')
    .first();
  await dashboardCommand.focus();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest(".side-panel-drawer") === null,
    ),
  ).toBe(true);

  await openPanel(page, "bookmarks-panel");
  const bookmarks = page.locator("#bookmarks-panel");
  await expect(bookmarks).not.toHaveAttribute("inert", "");
  const closeButton = bookmarks.locator(".side-panel-close");
  await closeButton.focus();
  await expect(closeButton).toBeFocused();

  await bookmarks.getByRole("button", { name: "Close Bookmarks" }).click();
  await expect(bookmarks).toHaveAttribute("aria-hidden", "true");
  await expect(bookmarks).toHaveAttribute("inert", "");
  expect(
    await closeButton.evaluate((element) => {
      element.focus();
      return document.activeElement === element;
    }),
  ).toBe(false);
});
