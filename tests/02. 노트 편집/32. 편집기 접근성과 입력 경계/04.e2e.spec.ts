import { expect, test } from "@playwright/test";

test("4. 줄 번호 영역은 Line numbers 접근성 이름을 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".line-rail")).toHaveAttribute(
    "aria-label",
    "Line numbers",
  );
});
