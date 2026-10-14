import { expect, type Page } from "@playwright/test";

import { deleteTabPopup } from "../../../__util__";

export type TabCloseCancellation = "escape" | "cancel" | "close" | "backdrop";

export async function expectTabCloseCancellation(
  page: Page,
  action: TabCloseCancellation,
) {
  const editor = page.locator("textarea");
  const popup = deleteTabPopup(page);
  await page.goto("/");
  await editor.fill("Do not delete this note");
  await editor.focus();
  await page.keyboard.press("Alt+Backspace");
  await expect(popup).toBeVisible();

  if (action === "escape") await page.keyboard.press("Escape");
  if (action === "cancel")
    await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  if (action === "close")
    await popup.getByRole("button", { name: "Close tab confirmation" }).click();
  if (action === "backdrop") await page.mouse.click(5, 5);

  await expect(popup).toHaveCount(0);
  await expect(page.getByRole("tab")).toHaveCount(1);
  await expect(editor).toHaveValue("Do not delete this note");
  await expect(editor).toBeFocused();
}
