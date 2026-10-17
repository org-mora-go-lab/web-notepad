import { expect, test } from "@playwright/test";

test("5. Panel Slide는 On과 Off를 제공하고 기본 Off를 선택한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  const group = page.getByRole("radiogroup", { name: "Panel Slide" });
  await expect(group.getByRole("radio")).toHaveCount(2);
  await expect(group.getByRole("radio", { name: "Off", exact: true })).toBeChecked();
});
