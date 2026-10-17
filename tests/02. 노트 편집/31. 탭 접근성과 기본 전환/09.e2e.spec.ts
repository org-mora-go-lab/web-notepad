import { expect, test } from "@playwright/test";

test("9. 탭 제목이 바뀌면 탭과 편집기의 접근성 이름을 함께 갱신한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("Accessible title\nBody");
  await expect(page.getByRole("tab", { name: "Accessible title" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Accessible title note content" })).toBeVisible();
});
