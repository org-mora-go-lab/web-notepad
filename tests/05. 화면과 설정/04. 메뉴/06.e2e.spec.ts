import { expect, test } from "@playwright/test";

test("6. MENU는 바깥 영역을 클릭하면 닫힌다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });

  await trigger.click();
  await page.locator("textarea").click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
