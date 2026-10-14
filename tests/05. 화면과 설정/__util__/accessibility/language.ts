import type { Page } from "@playwright/test";

import { chooseTabMenuItem, openSettingsPanel } from "../../../__util__";
import { languageRadio, settingsPanel } from "../settings";

type MarkedWorkspaceOptions = {
  bookmark?: boolean;
  pin?: boolean;
};

export async function prepareMarkedWorkspace(
  page: Page,
  { bookmark = false, pin = false }: MarkedWorkspaceOptions = {},
) {
  await page.goto("/");
  await page.locator(".note-area").fill("Alpha task\nBody");
  const tab = page.getByRole("tab", { name: "Alpha task", exact: true });
  if (bookmark) await chooseTabMenuItem(page, "Bookmark", tab);
  if (pin) await chooseTabMenuItem(page, "Pin", tab);
  return tab;
}

export async function switchWorkspaceToKorean(page: Page) {
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await languageRadio(page, "한국어").check();
  return panel;
}
