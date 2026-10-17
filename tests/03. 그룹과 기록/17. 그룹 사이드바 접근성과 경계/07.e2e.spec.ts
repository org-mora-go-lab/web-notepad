import { expect, test } from "@playwright/test";

test("7. 크기 조절선은 수직 separator 역할과 이름을 제공한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const separator = page.getByRole("separator", { name: "Resize group panel" });
  await expect(separator).toHaveAttribute("aria-orientation", "vertical");
});
