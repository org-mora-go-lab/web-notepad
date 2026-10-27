import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("7. 지원하지 않는 패널 위치는 오른쪽으로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { settings: { panelPosition: "center" } });
  await expect(page.locator(".home")).toHaveAttribute(
    "data-panel-position",
    "right",
  );
});
