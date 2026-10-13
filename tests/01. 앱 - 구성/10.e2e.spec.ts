import { expect, test } from "@playwright/test";

import { bookmarksCommand } from "../__util__";

test("10. 우측 패널의 열기·닫기를 브라우저 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");

  await bookmarksCommand(page).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(new URL(page.url()).searchParams.get("panel")).toBe("bookmarks");
  await page.reload();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.goBack();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await page.goForward();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await panel.getByRole("button", { name: "북마크 닫기" }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await page.goBack();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.goForward();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
