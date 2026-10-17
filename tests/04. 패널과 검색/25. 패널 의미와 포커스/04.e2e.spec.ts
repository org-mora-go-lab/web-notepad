import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("4. 설정 패널은 Settings 이름의 complementary 랜드마크다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await expect(page.getByRole("complementary", { name: "Settings" })).toBeVisible();
});
