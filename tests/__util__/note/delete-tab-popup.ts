import type { Page } from "@playwright/test";

export const deleteTabPopup = (page: Page) =>
  page.getByRole("alertdialog", { name: "Close tab" });

// Confirms the open tab delete popup with its exact "Close" button.
export async function confirmTabDelete(page: Page) {
  await deleteTabPopup(page).getByRole("button", { name: "Close", exact: true }).click();
}
