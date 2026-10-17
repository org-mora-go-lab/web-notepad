import { expect, test } from "@playwright/test";

test("3. 새 탭 버튼은 접근 가능한 이름과 툴팁을 제공한다", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "New tab", exact: true });
  await expect(button).toHaveAttribute("title", "New tab");
});
