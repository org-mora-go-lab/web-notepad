import { expect, test } from "@playwright/test";

test("9. 상태 컬럼은 상태 이름으로 접근 가능한 영역을 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await expect(page.getByRole("region", { name: "To Do" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Doing" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Done" })).toBeVisible();
});
