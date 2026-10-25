import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, settingsPanel } from "../__util__";

test("2. Font Size에서 80%~130%를 선택할 수 있으며 기본값은 90%다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);

  const radios = settingsPanel(page)
    .getByRole("radiogroup", { name: "Font Size" })
    .getByRole("radio");
  await expect(radios).toHaveCount(6);
  expect(await radios.evaluateAll(items => items.map(item => item.closest("label")?.textContent)))
    .toEqual(["80%", "90%", "100%", "110%", "120%", "130%"]);
  await expect(fontScaleRadio(page, "90%")).toBeChecked();

  for (const scale of ["80%", "90%", "100%", "110%", "120%", "130%"] as const) {
    await fontScaleRadio(page, scale).check();
    await expect(fontScaleRadio(page, scale)).toBeChecked();
  }
});
