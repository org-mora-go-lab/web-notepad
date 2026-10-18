import { expect, test } from "@playwright/test";

import { chooseTabMenuItem,moreCommand } from "../../__util__";

test("2. BOOKMARK는 개수를 표시하지 않고 오늘 생성된 북마크가 있으면 붉은 점을 표시한다", async ({ page }) => {
  await page.goto("/");
  const command = moreCommand(page);
  const dot = command.locator(".status-dot");
  await expect(dot).toHaveCount(0);

  await chooseTabMenuItem(page, "Bookmark");
  await expect(command.locator(".status-count")).toHaveCount(0);
  await expect(command).not.toContainText("1");
  await expect(dot).toBeVisible();
  await expect(dot).toHaveCSS("border-radius", "50%");
  await expect(dot).toHaveCSS("background-color", "rgb(255, 92, 92)");
});
