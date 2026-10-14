import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("8. 탭 색상 설명 아래에 10px 간격으로 괄호 없는 현재 순서를 표시한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const hint = settingsPanel(page).locator(".setting-hint");
  await expect(hint).toHaveText("New tabs start with the first color.Gray → Green → Purple");
  expect(await hint.innerText()).toBe(
    "New tabs start with the first color.\nGray → Green → Purple",
  );
  await expect(hint.locator(".setting-hint-text")).toHaveCSS("padding-bottom", "10px");
  await expect(hint.locator(".setting-color-guide")).not.toContainText(/[()]/);
});
