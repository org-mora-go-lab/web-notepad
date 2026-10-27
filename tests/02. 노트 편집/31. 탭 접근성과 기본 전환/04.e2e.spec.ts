import { expect, test } from "@playwright/test";

test("4. 탭 색상 버튼은 대상 탭 제목을 포함한 이름을 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Change - tab color" }),
  ).toBeVisible();
});
