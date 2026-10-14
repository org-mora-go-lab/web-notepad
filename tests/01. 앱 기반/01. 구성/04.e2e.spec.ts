import { expect, test } from "@playwright/test";

test("4. 개발 서버는 localhost와 127.0.0.1의 첫 접속에서 기본 작업공간을 연다", async ({
  page,
}) => {
  for (const origin of ["http://localhost:3000", "http://127.0.0.1:3000"]) {
    await page.goto(origin);
    await expect(page.locator(".workspace")).toBeVisible();
    await expect(page.locator(".note-area")).toBeVisible();
    await expect(page.locator(".group-select-name")).toHaveText("Ungrouped");
  }
});
