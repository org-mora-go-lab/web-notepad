import { expect, test } from "@playwright/test";

test("3. 사용 가이드 팝업은 처음 열면 Next 버튼에 포커스를 둔다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();

  await expect(page.getByRole("dialog").getByRole("button", { name: "Next" })).toBeFocused();
});
