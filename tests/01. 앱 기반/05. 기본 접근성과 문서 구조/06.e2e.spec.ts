import { expect, test } from "@playwright/test";

test("6. 모든 표시 중인 버튼은 명시적인 button 타입을 사용한다", async ({ page }) => {
  await page.goto("/");
  const types = await page.locator("button:visible").evaluateAll((buttons) => buttons.map((button) => button.getAttribute("type")));
  expect(types.every((type) => type === "button" || type === "submit")).toBe(true);
});
