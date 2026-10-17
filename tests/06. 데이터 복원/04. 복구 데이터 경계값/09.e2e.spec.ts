import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("9. 중복된 탭 색상 순환값은 기본 색상 순서로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { settings: { tabColorCycle: ["red", "red", "red"] } });
  await expect(page.locator(".tab-item")).toHaveAttribute("data-tab-color", "gray");
});
