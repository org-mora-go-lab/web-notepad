import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("1. Language에서 English·한국어를 각 언어 이름으로 표시하고 기본값은 English다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const group = settingsPanel(page).getByRole("radiogroup", {
    name: "Language",
  });
  await expect(group.getByRole("radio")).toHaveCount(2);
  await expect(languageRadio(page, "English")).toBeVisible();
  await expect(languageRadio(page, "한국어")).toBeVisible();
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(languageRadio(page, "한국어")).not.toBeChecked();
});
