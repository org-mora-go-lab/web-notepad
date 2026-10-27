import { expect, test } from "@playwright/test";

test("7. 선택된 줄 번호는 aria-pressed 상태를 true로 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  const line = page.locator(".line-rail").getByRole("button").first();
  await line.click();
  await expect(line).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".note-editor")).toHaveClass(/has-selected-line/);
});
