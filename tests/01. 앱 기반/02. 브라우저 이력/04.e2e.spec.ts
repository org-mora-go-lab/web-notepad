import { expect, test } from "@playwright/test";

import { openBookmarksPanel } from "../../__util__";

test("4. 우측 패널을 연 상태를 새로고침과 뒤로가기·앞으로가기로 복원한다", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#bookmarks-panel");

  await openBookmarksPanel(page);
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect.poll(() => new URL(page.url()).searchParams.get("panel")).toBe("bookmarks");
  await page.reload();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.goBack();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.goForward();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
});
