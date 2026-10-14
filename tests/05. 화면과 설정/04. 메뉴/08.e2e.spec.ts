import { expect, test } from "@playwright/test";

test("8. 사용 가이드는 Stop viewing 버튼으로 닫는다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  const guide = page.getByRole("dialog");
  const openGuide = async () => {
    await trigger.click();
    await page.locator(".additional-tools-guide").click();
    await expect(guide).toBeVisible();
  };

  await openGuide();
  await guide.getByRole("button", { name: "Next" }).click();
  await expect(guide.locator(".user-guide-progress")).toHaveText("2 / 10");
  await guide.getByRole("button", { name: "Stop viewing" }).click();
  await expect(guide).toHaveCount(0);

});
