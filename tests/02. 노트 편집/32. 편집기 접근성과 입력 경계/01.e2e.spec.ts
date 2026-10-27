import { expect, test } from "@playwright/test";

test("1. 편집기는 현재 탭 제목을 포함한 접근성 이름을 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("textbox", { name: "- note content" }),
  ).toBeVisible();
});
