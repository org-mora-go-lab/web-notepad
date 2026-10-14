import { expect, test } from "@playwright/test";

test("4. 편집기는 브라우저의 기본 붙여넣기 이벤트를 차단하지 않는다", async ({ page }) => {
  await page.goto("/");
  const prevented = await page.locator("textarea").evaluate((element) => {
    const event = new Event("paste", { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
});
