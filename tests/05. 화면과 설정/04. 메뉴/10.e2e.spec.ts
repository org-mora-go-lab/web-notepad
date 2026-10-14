import { expect, test } from "@playwright/test";

test("10. 가이드는 Previous·Next로 이동하고 10단계의 Close로 닫는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();
  const guide = page.getByRole("dialog");
  const progress = guide.locator(".user-guide-progress");
  const previous = guide.getByRole("button", { name: "Previous" });
  const next = guide.getByRole("button", { name: "Next" });
  const firstTitle = await guide.locator("h4").textContent();

  await next.click();
  await expect(progress).toHaveText("2 / 10");
  await expect(guide.locator("h4")).not.toHaveText(firstTitle!);
  await previous.click();
  await expect(progress).toHaveText("1 / 10");
  await expect(guide.locator("h4")).toHaveText(firstTitle!);
  for (let step = 2; step <= 10; step += 1) {
    await next.click();
    await expect(progress).toHaveText(`${step} / 10`);
  }
  await expect(next).toHaveCount(0);
  await expect(previous).toBeEnabled();
  const close = guide.getByRole("button", { name: "Close", exact: true });
  await expect(close).toBeFocused();
  await close.click();
  await expect(guide).toHaveCount(0);
});
