import { expect, test } from "@playwright/test";

test("5. 각 줄 번호는 키보드 포커스를 받을 수 있는 버튼 역할로 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  const line = page.locator(".line-rail").getByRole("button").first();
  await expect(line).toHaveAttribute("tabindex", "0");
});
