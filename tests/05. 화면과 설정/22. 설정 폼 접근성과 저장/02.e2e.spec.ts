import { expect, test } from "@playwright/test";

test("2. Font Size는 여섯 가지 선택지를 제공하고 기본 100%를 선택한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "SETTINGS" }).click();
  const group = page.getByRole("radiogroup", { name: "Font Size" });
  await expect(group.getByRole("radio")).toHaveCount(6);
  await expect(group.getByRole("radio", { name: "100%" })).toBeChecked();
});
