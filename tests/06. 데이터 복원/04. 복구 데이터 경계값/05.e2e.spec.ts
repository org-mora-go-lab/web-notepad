import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("5. 지원하지 않는 글자 배율은 100%로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { settings: { fontScale: 9 } });
  await expect(page.locator(".home")).toHaveCSS("--font-scale", "1");
});
