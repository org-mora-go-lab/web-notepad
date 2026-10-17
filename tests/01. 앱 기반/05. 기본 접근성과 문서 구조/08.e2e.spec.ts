import { expect, test } from "@playwright/test";

test("8. 장식용 하단 구분 문자는 접근성 트리에서 숨긴다", async ({ page }) => {
  await page.goto("/");
  const separators = page.locator(".footer .status-separator");
  await expect(separators).toHaveCount(1);
  for (const separator of await separators.all()) await expect(separator).toHaveAttribute("aria-hidden", "true");
});
