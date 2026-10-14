import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("5. English로 되돌리면 MENU와 설정 패널의 영문 접근성 이름을 복원한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await languageRadio(page, "한국어").check();
  await languageRadio(page, "English").check();

  await expect(panel).toHaveAttribute("aria-label", "Settings");
  await expect(panel.getByRole("separator", { name: "Resize panel" })).toBeVisible();
  await expect(panel.getByRole("button", { name: "Close Settings", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "MENU", exact: true })).toBeVisible();
});
