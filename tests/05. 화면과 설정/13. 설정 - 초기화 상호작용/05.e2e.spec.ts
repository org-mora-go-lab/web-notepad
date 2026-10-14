import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("5. 설정 초기화를 완료해도 설정 패널을 열린 상태로 유지한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await panel.getByRole("button", { name: "Reset settings", exact: true }).click();
  await page.getByRole("alertdialog", { name: "Reset settings" })
    .getByRole("button", { name: "Reset", exact: true }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel).toBeVisible();
});
