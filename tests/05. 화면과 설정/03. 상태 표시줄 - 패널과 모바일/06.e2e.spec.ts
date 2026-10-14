import { expect, test } from "@playwright/test";

test("6. 미고정 패널은 닫기 버튼으로 닫고 하단 메뉴 활성 표시를 해제한다", async ({ page }) => {
  await page.goto("/");

  const bookmarkCommand = page.locator(".bookmark-command");
  const bookmarks = page.locator("#bookmarks-panel");
  await bookmarkCommand.click();
  await bookmarks.locator(".side-panel-close").click();
  await expect(bookmarks).toHaveAttribute("aria-hidden", "true");
  await expect(bookmarkCommand).not.toHaveClass(/is-active/);
});
