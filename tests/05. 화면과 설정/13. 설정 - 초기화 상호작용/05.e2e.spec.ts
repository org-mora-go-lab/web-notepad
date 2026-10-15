import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { tabColorRadio } from "../__util__";

test("5. 앞 순번에서 사용 중인 탭 색상은 뒤 순번에서 키보드로 선택할 수 없다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const disabled = tabColorRadio(page, 2, "Gray");
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((element) => element.focus());
  await page.keyboard.press("Space");
  await expect(disabled).not.toBeChecked();
  await expect.poll(() => page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).state.settings.tabColorCycle,
    STORAGE_KEY,
  )).toEqual(["gray", "green", "purple"]);
});
