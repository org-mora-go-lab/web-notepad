import { expect, test } from "@playwright/test";

import { bookmarksCommand } from "../../__util__";

test("6. 우측 패널을 닫은 이력으로 열림과 닫힘 상태를 복원한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");
  await bookmarksCommand(page).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await panel.getByRole("button", { name: "Close Bookmarks" }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => new URL(page.url()).searchParams.get("panel")).toBeNull();

  await page.goBack();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.goForward();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
