import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { settingsPanel } from "../__util__";

test("1. Language 아래 Panel Slide에서 On·Off를 선택할 수 있으며 기본값은 Off다", async ({
  page,
}) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const headings = panel.locator(".setting-section h3");
  await expect(headings.nth(3)).toHaveText("Language");
  await expect(headings.nth(4)).toHaveText("Panel Slide");
  const slide = panel.getByRole("radiogroup", { name: "Panel Slide" });
  const on = slide.getByRole("radio", { name: "On", exact: true });
  const off = slide.getByRole("radio", { name: "Off", exact: true });
  await expect(off).toBeChecked();
  await on.check();
  await expect(on).toBeChecked();
  await off.check();
  await expect(off).toBeChecked();
});
