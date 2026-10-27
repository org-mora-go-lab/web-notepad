import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("8. 불리언이 아닌 패널 슬라이드 값은 Off로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { settings: { panelSlide: "yes" } });
  await expect(page.locator(".home")).toHaveAttribute(
    "data-panel-slide",
    "off",
  );
});
