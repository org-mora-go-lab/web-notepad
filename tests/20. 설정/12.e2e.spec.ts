import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../__constant__";
import { openSettingsPanel } from "../__util__";
import { settingsPanel, tabColorRadio } from "./__util__";

test("12. 앞 순번에서 선택된 색상은 뒤 순번에서 흐리게 표시하고 선택할 수 없게 비활성화한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await expect(settingsPanel(page)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

  // Default order is Green → Gray → Red.
  for (const [order, color] of [[2, "Green"], [3, "Green"], [3, "Gray"]] as const) {
    const radio = tabColorRadio(page, order, color);
    await expect(radio).toBeDisabled();
    await expect(radio).toHaveCSS("opacity", "0.25");
    await expect(radio).toHaveCSS("cursor", "not-allowed");
  }
  for (const [order, color] of [[1, "Gray"], [1, "Red"], [2, "Red"], [2, "Pink"], [3, "Pink"]] as const) {
    await expect(tabColorRadio(page, order, color)).toBeEnabled();
    await expect(tabColorRadio(page, order, color)).toHaveCSS("opacity", "1");
  }

  await tabColorRadio(page, 3, "Gray").click({ force: true });
  await expect(tabColorRadio(page, 3, "Red")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Gray")).toBeChecked();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings.tabColorCycle, STORAGE_KEY))
    .toEqual(["green", "gray", "red"]);

  // The lock follows the earlier slots when they change.
  await tabColorRadio(page, 1, "Pink").check();
  await expect(tabColorRadio(page, 2, "Pink")).toBeDisabled();
  await expect(tabColorRadio(page, 3, "Pink")).toBeDisabled();
  await expect(tabColorRadio(page, 2, "Green")).toBeEnabled();
});
