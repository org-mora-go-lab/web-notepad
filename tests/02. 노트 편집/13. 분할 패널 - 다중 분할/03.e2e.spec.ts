import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { hoverTabOverPane, moveOverPane, paneSlot } from "../__util__";

test("3. Split down 영역은 드래그한 탭이 편집기 높이의 중앙보다 아래에 있을 때만 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("a");
  await addTabButton(page).click();
  await page.locator("textarea").fill("b");
  const tab = page.locator(".tab-item").filter({ hasText: /^b$/ });
  const left = paneSlot(page, "left");
  const splitDown = left.locator(".note-pane-drop", { hasText: "Split down" });

  const release = await hoverTabOverPane(page, tab, left, 0.25, 0.4);
  await expect(left.locator(".note-pane-drop", { hasText: "Split right" })).toBeVisible();
  await expect(splitDown).toHaveCount(0);
  await moveOverPane(page, left, 0.25, 0.6);
  await expect(splitDown).toBeVisible();
  await moveOverPane(page, left, 0.25, 0.4);
  await expect(splitDown).toHaveCount(0);
  await release();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
});
