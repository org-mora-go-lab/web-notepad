import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("1. Font Size 설정은 제목으로 이름이 지정된 radiogroup이다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await expect(page.getByRole("radiogroup", { name: "Font Size" })).toBeVisible();
});
