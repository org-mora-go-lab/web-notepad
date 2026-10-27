import { expect, test } from "@playwright/test";

test("1. 앱의 주 콘텐츠는 하나의 main 랜드마크로 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("main")).toHaveCount(1);
});
