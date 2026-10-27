import { expect, test } from "@playwright/test";

test("7. 사이드 패널 크기 조절선은 수직 separator로 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  const separator = page
    .locator("#dashboard-panel")
    .getByRole("separator", { name: "Resize panel" });
  await expect(separator).toHaveAttribute("aria-orientation", "vertical");
});
