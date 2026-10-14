import { expect, test } from "@playwright/test";

test("8. 사용 가이드는 그만 보기 버튼이나 Escape로 닫고 다시 열면 1단계부터 표시한다", async ({ page }) => {
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

  await openGuide();
  await expect(guide.locator(".user-guide-progress")).toHaveText("1 / 10");
  await page.keyboard.press("Escape");
  await expect(guide).toHaveCount(0);
});
