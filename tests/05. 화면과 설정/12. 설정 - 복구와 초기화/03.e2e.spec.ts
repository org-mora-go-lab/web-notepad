import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("3. 설정 초기화 버튼은 안내 팝업을 열고 Cancel에 기본 포커스를 둔다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await settingsPanel(page)
    .getByRole("button", { name: "Reset settings", exact: true })
    .click();
  const popup = page.getByRole("alertdialog", { name: "Reset settings" });
  await expect(popup).toBeVisible();
  await expect(popup).toContainText(
    "All settings will return to their defaults. Do you want to reset them?",
  );
  await expect(
    popup.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
});
