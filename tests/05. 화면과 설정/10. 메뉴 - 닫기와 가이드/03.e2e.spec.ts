import { expect, test } from "@playwright/test";

test("3. 진행 중 닫은 사용 가이드를 다시 열면 1단계부터 표시한다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  const openGuide = async () => {
    await trigger.click();
    await page.getByRole("menuitem", { name: "GUIDE" }).click();
  };
  await openGuide();
  const guide = page.getByRole("dialog");
  await guide.getByRole("button", { name: "Next" }).click();
  await expect(guide.locator(".user-guide-progress")).toHaveText("2 / 10");
  await guide.getByRole("button", { name: "Stop viewing" }).click();
  await openGuide();
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 10");
});
